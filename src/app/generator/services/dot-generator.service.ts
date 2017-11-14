import { Injectable } from '@angular/core';
import {IGenerator} from '../interfaces/generator';
import {IModel} from '../../model/model.module';
import {ITemplate} from '../../channel/channel.module';

@Injectable()
export class DotGeneratorService implements IGenerator {

  /**
   * @inheritDoc
   */
  async run(model: IModel, template: ITemplate): Promise<string> {
    return 'success';
  }
}
