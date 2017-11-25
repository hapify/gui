import {Injectable} from '@angular/core';
import {IGenerator} from '../interfaces/generator';
import {IModel} from '../../model/model.module';
import {ITemplate} from '../../channel/channel.module';
import {StringService} from '../../services/string.service';
import doT from 'dot';

@Injectable()
export class DotGeneratorService implements IGenerator {

  /**
   * Constructor
   *
   * @param stringService
   */
  constructor(private stringService: StringService) {
    doT.templateSettings.strip = false;
  }

  /**
   * @inheritDoc
   */
  async run(model: IModel, template: ITemplate): Promise<string> {

    // Create template function
    const templateFunction = doT.template(template.content);

    // Create object
    const m: any = model.toObject();

    // Convert names
    m.names = this.stringService.formatSentences(m.name);
    m.fields = m.fields.map((f) => {
      f.names = this.stringService.formatSentences(f.name);
      return f;
    });

    const output = templateFunction({ model: m, m });

    return output;
  }
}
