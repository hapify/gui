import {ITemplate} from '../../channel/interfaces/template';
import {IFormattedSentences} from '../../interfaces/formatted-sentences';

export interface IGenerator {

  /**
   * Run generation process
   *
   * @param {any} model
   * @param {IFormattedSentences[]} all
   *  Only models names
   * @param {ITemplate} template
   * @returns {Promise<string>}
   */
  run(model: any, all: IFormattedSentences[], template: ITemplate): Promise<string>;
}

