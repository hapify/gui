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
      content = await this.dotGeneratorService.run(this.explicitModel(model), template);
    } else {
      throw new Error('Unknown engine');
    }

    return {
      content,
      path
    };
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

  /**
   * Convert the model to an object containing all its properties
   *
   * @param {IModel} model
   */
  protected explicitModel(model: IModel): any {

    // Create object
    const m: any = model.toObject();

    // Convert names
    m.names = this.stringService.formatSentences(m.name);

    // Get and format fields
    const fields = m.fields.map((f) => {
      f.names = this.stringService.formatSentences(f.name);
      return f;
    });

    // Get primary field
    const primary = fields.find((f) => f.primary);

    // Get searchable fields
    const searchable = fields.filter((f) => f.searchable);

    // Get sortable fields
    const sortable = fields.filter((f) => f.sortable);

    // Get private fields
    const isPrivate = fields.filter((f) => f.isPrivate);

    // Get internal fields
    const internal = fields.filter((f) => f.internal);

    // Set fields to model
    m.fields = {
      list: fields,
      l: fields,
      primary,
      p: primary,
      searchable,
      se: searchable,
      sortable,
      so: sortable,
      isPrivate,
      ip: isPrivate,
      internal,
      i: internal
    };

    // Add short name
    m.f = m.fields;

    return m;
  }

}
