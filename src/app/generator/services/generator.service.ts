import { Injectable } from '@angular/core';
import {IGenerator} from '../interfaces/generator';
import {DotGeneratorService} from './dot-generator.service';
import {IModel} from '../../model/model.module';
import {ITemplate, TemplateEngine} from '../../channel/channel.module';

@Injectable()
export class GeneratorService implements IGenerator {

  /**
   * Constructor
   *
   * @param dotGeneratorService
   */
  constructor(private dotGeneratorService: DotGeneratorService) {
  }

  /**
   * @inheritDoc
   */
  async run(model: IModel, template: ITemplate): Promise<string> {

    if (template.engine === TemplateEngine.doT) {
      return await this.dotGeneratorService.run(model, template);
    }

    throw new Error('Unknown engine');
  }
}
