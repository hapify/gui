import {ITemplate} from '../../channel/interfaces/template';

export interface IGenerator {

  /**
   * Run generation process for one model
   *
   * @param {any} model
   * @param {ITemplate} template
   * @returns {Promise<string>}
   */
  one(model: any, template: ITemplate): Promise<string>;

  /**
   * Run generation process for one model
   *
   * @param {any[]} models
   *  All models in the project
   * @param {ITemplate} template
   * @returns {Promise<string>}
   */
  all(models: any[], template: ITemplate): Promise<string>;
}

