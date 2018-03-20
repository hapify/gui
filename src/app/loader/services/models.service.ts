import {Injectable} from '@angular/core';
import {StorageService as ModelStorageService, Model} from '../../model/model.module';
import {IModelManifest} from '../interfaces/models-manifest';

@Injectable()
export class ModelsService {

  /**
   * Constructor
   *
   * @param {StorageService} modelStorageService
   */
  constructor(private modelStorageService: ModelStorageService) {
  }

  /**
   * Load from parsed zip file
   *
   * @param {string} content
   * @returns {Promise<void>}
   */
  async loadFromContent(content: string): Promise<void> {
    // Parse content
    const json: IModelManifest[] = JSON.parse(content);
    const models = await Promise.all(json.map((model) => this._loadModel(model)));
    // Load new content
    await models.map((model: Model) => async () => {
      // Clean previous version
      await this.modelStorageService.remove(model);
      // Save new
      await this.modelStorageService.add(model);
    }).reduce((p, fn) => p.then(fn), Promise.resolve());
  }

  /**
   * Load a single channel
   *
   * @param {DemoModel} model
   * @return {Promise<Model>}
   * @private
   */
  private async _loadModel(model: IModelManifest): Promise<Model> {

    // Create and populate model
    const output = new Model();
    output.fromObject(model);

    return output;
  }


}