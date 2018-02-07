import {Injectable} from '@angular/core';
import {IGenerator} from '../interfaces/generator';
import {ITemplate} from '../../channel/channel.module';
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
  async one(model: any, template: ITemplate): Promise<string> {

    // Create template function
    const templateFunction = doT.template(template.content);
    return templateFunction({ model, m: model, o: '{{', c: '}}' });
  }

  /**
   * @inheritDoc
   */
  async all(models: any[], template: ITemplate): Promise<string> {
    
    // Create template function
    const templateFunction = doT.template(template.content);
    return templateFunction({ models, m: models, o: '{{', c: '}}' });
  }
}
