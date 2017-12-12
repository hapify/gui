import {Injectable} from '@angular/core';
import {IGenerator} from '../interfaces/generator';
import {ITemplate} from '../../channel/channel.module';
import {IFormattedSentences} from '../../interfaces/formatted-sentences';
import doT from 'dot';

@Injectable()
export class DotGeneratorService implements IGenerator {

  /**
   * Constructor
   */
  constructor() {
    doT.templateSettings.strip = false;
  }

  /**
   * @inheritDoc
   */
  async run(model: any, all: IFormattedSentences[], template: ITemplate): Promise<string> {

    // Create template function
    const templateFunction = doT.template(template.content);
    console.log({ model, m: model, all });
    return templateFunction({ model, m: model, all });
  }
}
