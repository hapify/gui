import {ITemplate} from '../../channel/interfaces/template';

export interface IGenerator {

  /**
   * Run generation process
   *
   * @param {any} model
   * @param {ITemplate} template
   * @returns {Promise<string>}
   */
  run(model: any, template: ITemplate): Promise<string>;
}

