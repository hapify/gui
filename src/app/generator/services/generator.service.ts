import {Injectable} from '@angular/core';
import {DotGeneratorService} from './dot-generator.service';
import {IModel} from '../../model/model.module';
import {ITemplate, TemplateEngine} from '../../channel/channel.module';
import {IGeneratorResult} from '../interfaces/generator-result';
import {StringService} from '../../services/string.service';
import {SentenceFormat} from '../../interfaces/sentence-format.enum';
import {FieldType} from '../../model/interfaces/field-type.enum';
import {StorageService as ModelStorageService} from '../../model/services/storage.service';
import {IChannel} from '../../channel/interfaces/channel';

import JSZip from 'jszip';
import FileSaver from 'file-saver';

@Injectable()
export class GeneratorService {

  /**
   * Constructor
   *
   * @param modelStorageService
   * @param stringService
   * @param dotGeneratorService
   */
  constructor(private modelStorageService: ModelStorageService,
              private stringService: StringService,
              private dotGeneratorService: DotGeneratorService) {
  }

  /**
   * Run generation process
   *
   * @param {ITemplate} template
   * @param {IModel|null} model
   * @returns {Promise<IGeneratorResult>}
   */
  run(template: ITemplate, model: IModel|null): Promise<IGeneratorResult> {
    if (template.needsModel()) {
      if (!model) {
        throw new Error('Model should be defined for this template');
      }
      return this._one(template, model);
    } else {
      return this._all(template);
    }
  }

  /**
   * Run generation process for one model
   *
   * @param {ITemplate} template
   * @param {IModel} model
   * @returns {Promise<IGeneratorResult>}
   * @private
   */

  private async _one(template: ITemplate, model: IModel): Promise<IGeneratorResult> {

    // Compute path
    const path = this.getPath(model, template);
    // Get full model description
    const input = await this.explicitModel(model);

    // Compute content
    let content;
    if (template.engine === TemplateEngine.doT) {
      // Get content
      content = await this.dotGeneratorService.one(input, template);
    } else {
      throw new Error('Unknown engine');
    }

    return {
      content,
      path
    };
  }

  /**
   * Run generation process for all models
   *
   * @param {ITemplate} template
   * @returns {Promise<IGeneratorResult>}
   * @private
   */
  private async _all(template: ITemplate): Promise<IGeneratorResult> {

    // Compute path
    const path = template.path;
    // Get full model description
    const input =  await Promise.all((await this.modelStorageService.list())
      .map( (mod: IModel) => this.explicitModel(mod)));

    // Compute content
    let content;
    if (template.engine === TemplateEngine.doT) {
      // Get content
      content = await this.dotGeneratorService.all(input, template);
    } else {
      throw new Error('Unknown engine');
    }

    return {
      content,
      path
    };
  }

  /**
   * Download all models through all templates
   *
   * @param {IModel} models
   * @param {IChannel} channel
   * @returns {Promise<void>}
   */
  async download(models: IModel[], channel: IChannel): Promise<void> {
    // Create results stack
    const promises: Promise<IGeneratorResult>[] = [];
    // For each template, build each models
    channel.templates.forEach((template: ITemplate) => {
      if (template.needsModel()) {
        models.forEach((model: IModel) => {
          promises.push(this._one(template, model));
        });
      } else {
        promises.push(this._all(template));
      }
    });
    // Wait results
    const contents = await Promise.all(promises);
    // If no contents, scream
    if (!contents.length) {
      throw new Error('No contents generated');
    }
    // Create ZIP
    const zip = new JSZip();
    // Append files
    contents.forEach((content: IGeneratorResult) => {
      zip.file(content.path, content.content);
    });
    // Generate ZIP
    const blob = await zip.generateAsync({ type: 'blob' });
    // Force download
    const fileName = this.stringService.format(channel.name, SentenceFormat.SlugHyphen);
    FileSaver.saveAs(blob, `${fileName}.zip`);
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
   * @param {number} depth
   * @return {Promise<any>}
   */
  protected async explicitModel(model: IModel, depth = 0): Promise<any> {

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

    // Add references on first level
    if (depth === 0) {

      // Construct promises
      // Then explicit the reference. If no reference is found returns null (it will be filtered after)
      const promises = fields.filter((f) => (f.type === FieldType.Entity) && f.reference)
        .map((field) => {
          return this.modelStorageService.find(field.reference)
            .then(async (reference) => {
              // Nothing found
              if (!reference) {
                return null;
              }
              // Add reference to object
              const subField = await this.explicitModel(reference, depth + 1);
              field.model = subField;
              field.m = subField;

              return field;
            });
        });

      // Get reference fields
      const references = (await Promise.all(promises)).filter((f) => f);

      // Add to object
      m.fields.references = references;
      m.fields.r = references;
    }

    // Add short name
    m.f = m.fields;

    return m;
  }

}
