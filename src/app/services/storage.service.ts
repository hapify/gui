import {Injectable} from '@angular/core';
import {IModel} from '../model/interfaces/model';
import {Model} from '../model/classes/model';

@Injectable()
export class StorageService {

  /**
   * Cached models
   *
   * @type {IModel[]}
   * @private
   */
  private _models: IModel[] = null;
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
   * Returns the current models
   *
   * @returns {Promise<IModel[]>}
   */
  async models(): Promise<IModel[]> {
    // Create the cached models if not created
    if (this._models === null) {
      const json = this._storage.getItem('models');
      // If the models are not created yet, keep null as value
      const objects = typeof json === 'string' && json.length ? JSON.parse(json) : [];
      // Create models from objects
      this._models = objects.map((object) => {
        const model = this.newModel();
        model.fromObject(object);
        return model;
      });
    }
    // Returns models
    return this._models;
  }

  /**
   * Save current models to storage
   *
   * @protected
   * @param {IModel[]} models
   * @returns {Promise<void>}
   */
  protected async saveModels(models: IModel[]): Promise<void> {
    // Convert models
    const objects = models.map((model) => model.toObject());
    // Store
    this._storage.setItem('models', JSON.stringify(objects));
    // Clear cache
    this._models = null;
  }

  /**
   * Push a model into the storage
   *
   * @param {IModel} model
   * @returns {Promise<void>}
   */
  async addModel(model: IModel): Promise<void> {
    // Add the model to the list
    const models = await this.models();
    models.push(model);
    // Save the models
    await this.saveModels(models);
  }

  /**
   * Find a model with its id
   *
   * @param {string} id
   * @returns {Promise<IModel>}
   */
  async findModel(id: string): Promise<IModel> {
    // Add the model to the list
    const models = await this.models();
    // Find model
    return models.find((model) => model.id === id);
  }

  /**
   * Find a model and remove it
   *
   * @param {IModel} model
   * @returns {Promise<void>}
   */
  async deleteModel(model: IModel): Promise<void> {
    // Add the model to the list
    const models = (await this.models())
      .filter((m) => m.id !== model.id);
    // Find model
    await this.saveModels(models);
  }

  /**
   * Find a model and replace it with its new version
   *
   * @param {IModel} model
   * @returns {Promise<void>}
   */
  async updateModel(model: IModel): Promise<void> {
    // Remove model
    await this.deleteModel(model);
    // Push new vesion
    await this.addModel(model);
  }

  /**
   * Returns a new model instance
   *
   * @protected
   * @returns {IModel}
   */
  protected newModel(): IModel {
    return new Model();
  }

}
