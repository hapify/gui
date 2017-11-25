import {Injectable} from '@angular/core';
import {DotGeneratorService} from './dot-generator.service';
import {IModel} from '../../model/model.module';
import {ITemplate, TemplateEngine} from '../../channel/channel.module';
import {IGeneratorResult} from '../interfaces/generator-result';
import {StringService} from '../../services/string.service';
import {SentenceFormat} from '../../interfaces/sentence-format.enum';

@Injectable()
export class GeneratorService {

  /**
   * Constructor
   *
   * @param stringService
   * @param dotGeneratorService
   */
  constructor(private stringService: StringService,
              private dotGeneratorService: DotGeneratorService) {
  }

  /**
   * Run generation process
   *
   * @param {IModel} model
   * @param {ITemplate} template
   * @returns {Promise<IGeneratorResult>}
   */
  async run(model: IModel, template: ITemplate): Promise<IGeneratorResult> {

    // Compute path
    const path = this.getPath(model, template);

    // Compute content
    let content;
    if (template.engine === TemplateEngine.doT) {
      content = await this.dotGeneratorService.run(model, template);
    }
    else {
      throw new Error('Unknown engine');
    }

    return {
      content,
      path
    }
  }

  /**
   * Compute path
   *
   * @param {IModel} model
   * @param {ITemplate} template
   * @returns {string}
   * @protected
   */
  protected getPath(model: IModel, template: ITemplate): string {

    // Get path
    let path = template.path;

    // Apply replacements
    path = path.replace(/{model\.hyphen}/g, this.stringService.format(model.name, SentenceFormat.SlugHyphen));
    path = path.replace(/{model\.underscore}/g, this.stringService.format(model.name, SentenceFormat.SlugUnderscore));
    path = path.replace(/{model\.oneWord}/g, this.stringService.format(model.name, SentenceFormat.SlugOneWord));
    path = path.replace(/{model\.upperCamel}/g, this.stringService.format(model.name, SentenceFormat.UpperCamelCase));
    path = path.replace(/{model\.lowerCamel}/g, this.stringService.format(model.name, SentenceFormat.LowerCamelCase));

    return path;
  }

}
