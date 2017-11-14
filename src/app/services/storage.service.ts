import {IStorable} from '../interfaces/storable';

export abstract class StorageService {

  /**
   * Cached instances
   *
   * @type {IStorable[]}
   * @private
   */
  private _instances: IStorable[] = null;
  /**
   * The storage used to keep data
   *
   * @type {Storage}
   * @private
   */
  private _storage: Storage = localStorage;

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Returns the current instances
   *
   * @returns {Promise<IStorable[]>}
   */
  async list(): Promise<IStorable[]> {
    // Create the cached instances if not created
    if (this._instances === null) {
      const json = this._storage.getItem(this.bucket());
      // If the instances are not created yet, keep null as value
      const objects = typeof json === 'string' && json.length ? JSON.parse(json) : [];
      // Create instances from objects
      this._instances = objects.map((object) => {
        const instance = this.instance();
        instance.fromObject(object);
        return instance;
      });
    }
    // Returns instances
    return this._instances;
  }

  /**
   * Save current instances to storage
   *
   * @protected
   * @param {IStorable[]} instances
   * @returns {Promise<void>}
   */
  protected async save(instances: IStorable[]): Promise<void> {
    // Convert instances
    const objects = instances.map((instance) => instance.toObject());
    // Store
    this._storage.setItem(this.bucket(), JSON.stringify(objects));
    // Clear cache
    this._instances = null;
  }

  /**
   * Push a instance into the storage
   *
   * @param {IStorable} instance
   * @returns {Promise<void>}
   */
  async add(instance: IStorable): Promise<void> {
    // Add the instance to the list
    const instances = await this.list();
    instances.push(instance);
    // Save the instances
    await this.save(instances);
  }

  /**
   * Find a instance with its id
   *
   * @param {string} id
   * @returns {Promise<IStorable>}
   */
  async find(id: string): Promise<IStorable> {
    // Add the instance to the list
    const instances = await this.list();
    // Find instance
    return instances.find((instance) => instance.id === id);
  }

  /**
   * Find a instance and remove it
   *
   * @param {IStorable} instance
   * @returns {Promise<void>}
   */
  async remove(instance: IStorable): Promise<void> {
    // Add the instance to the list
    const instances = (await this.list())
      .filter((m) => m.id !== instance.id);
    // Find instance
    await this.save(instances);
  }

  /**
   * Find a instance and replace it with its new version
   *
   * @param {IStorable} instance
   * @returns {Promise<void>}
   */
  async update(instance: IStorable): Promise<void> {
    // Remove instance
    await this.remove(instance);
    // Push new version
    await this.add(instance);
  }

  /**
   * Returns a new instance
   *
   * @protected
   * @returns {IStorable}
   */
  protected abstract instance(): IStorable;

  /**
   * Returns the name of the bucket to store data
   *
   * @protected
   * @returns {string}
   */
  protected abstract bucket(): string;

}
