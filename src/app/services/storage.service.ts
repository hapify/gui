import {IStorable} from '../interfaces/storable';
import {WebSocketService} from './websocket.service';
import {Injectable} from '@angular/core';

@Injectable()
export abstract class StorageService {

  /** @type {IStorable[]} Cached instances */
  private _instances: IStorable[] = null;
  /** @type {Boolean} Pending reading */
  private _locked = false;

  /** Constructor */
  constructor(protected _websocketService: WebSocketService) {
  }

  /**
   * Returns the current instances
   * @returns {Promise<IStorable[]>}
   */
  async list(): Promise<IStorable[]> {
    // Wait for other process to be finished
    await this.lock();
    // Create the cached instances if not created
    if (this._instances === null) {
      const result = await this._websocketService.send(this.getMessageId())
        .catch(() => []);
      // If the instances are not created yet, use []
      const objects = result instanceof Array ? result : [];
      // Create instances from objects
      this._instances = objects.map((object) => {
        const instance = this.instance();
        instance.fromObject(object);
        return instance;
      });
    }
    // Release the lock
    this.release();
    // Returns instances
    return this._instances;
  }

  /**
   * Save current instances to storage
   * @protected
   * @param {IStorable[]} instances
   * @returns {Promise<void>}
   */
  protected async save(instances: IStorable[]): Promise<void> {
    // Convert instances
    const objects = instances.map((instance) => instance.toObject());
    // Store
    await this._websocketService.send(this.setMessageId(), objects);
    // Clear cache
    this._instances = null;
  }

  /**
   * Push a instance into the storage
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
   * Clear all the storage
   * @returns {Promise<void>}
   */
  async clear(): Promise<void> {
    await this.save([]);
  }

  /**
   * Find a instance and replace it with its new version
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
   * Resolves when the client is ready
   * @return {Promise<void>}
   */
  private async lock() {
    if (!this._locked) {
      this._locked = true;
      return;
    }
    await new Promise((resolve => {
      setTimeout(() => resolve(this.lock()), 10);
    }));
  }
  /**
   * Resolves when the client is ready
   * @return {Promise<void>}
   */
  private release() {
    this._locked = false;
  }

  /**
   * Returns a new instance
   * @protected
   * @returns {IStorable}
   */
  protected abstract instance(): IStorable;

  /**
   * Returns the name of the websocket set message id
   * @protected
   * @returns {string}
   */
  protected abstract setMessageId(): string;

  /**
   * Returns the name of the websocket set message id
   * @protected
   * @returns {string}
   */
  protected abstract getMessageId(): string;

}
