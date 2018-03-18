import {Injectable} from '@angular/core';
import {IGenerator} from '../interfaces/generator';
import {ITemplate} from '../../channel/channel.module';

@Injectable()
export class JavaScriptGeneratorService implements IGenerator {

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * @inheritDoc
   */
  async one(model: any, template: ITemplate): Promise<string> {

    // Eval template content
    const m = model;
    return eval(template.content);
  }

  /**
   * @inheritDoc
   */
  async all(models: any[], template: ITemplate): Promise<string> {

    // Create template function
    const m = models;
    return eval(template.content);
  }
}
