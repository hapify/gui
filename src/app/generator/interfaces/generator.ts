import {IModel} from '../../model/interfaces/model';
import {ITemplate} from '../../channel/interfaces/template';

export interface IGenerator {

  /**
   * Run generation process
   *
   * @param {IModel} model
   * @param {ITemplate} template
   * @returns {Promise<string>}
   */
  run(model: IModel, template: ITemplate): Promise<string>;
}

