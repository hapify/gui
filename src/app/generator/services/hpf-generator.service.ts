import {Injectable} from '@angular/core';
import {IGenerator} from '../interfaces/generator';
import {ITemplate} from '../../channel/channel.module';
import {HapifySyntax} from 'hapify-syntax';

@Injectable()
export class HpfGeneratorService implements IGenerator {

  /**
   * Constructor
   */
  constructor() {}

  /**
   * @inheritDoc
   */
  async one(model: any, template: ITemplate): Promise<string> {

    // Create template function
    const content = HapifySyntax.run(template.content, model);
    return await this._postProcess(content);
  }

  /**
   * @inheritDoc
   */
  async all(models: any[], template: ITemplate): Promise<string> {

    // Create template function
    const content = HapifySyntax.run(template.content, models);
    return await this._postProcess(content);
  }

  /**
   * Cleanup code after process
   *
   * @param {string} code
   * @return {Promise<string>}
   * @private
   */
  private async _postProcess(code: string) {

    const doubleLine = /\r?\n\r?\n/g;
    while (code.match(doubleLine)) {
      code = code.replace(doubleLine, '\n');
    }

    const doubleLineWithSpace = /\r?\n *\r?\n/g;
    code = code.replace(doubleLineWithSpace, '\n\n');
    code = code.replace(doubleLineWithSpace, '\n\n');

    return code;
  }
}
