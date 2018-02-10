import {Injectable} from '@angular/core';
import {DotGeneratorService} from './dot-generator.service';
import {JavaScriptGeneratorService} from './js-generator.service';
import {IModel, IField} from '../../model/model.module';
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
   * @param javaScriptGeneratorService
   */
  constructor(private modelStorageService: ModelStorageService,
              private stringService: StringService,
              private dotGeneratorService: DotGeneratorService,
              private javaScriptGeneratorService: JavaScriptGeneratorService) {
  }

  /**
   * Run generation process
   *
   * @param {ITemplate} template
   * @param {IModel|null} model
   * @returns {Promise<IGeneratorResult>}
   * @throws {Error}
   *  If the template needs a model and no model is passed
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
   * Only process the path
   *
   * @param {ITemplate} template
   * @param {IModel|null} model
   * @returns {string}
   * @throws {Error}
   *  If the template needs a model and no model is passed
   */
  path(template: ITemplate, model: IModel|null): string {
    if (template.needsModel()) {
      if (!model) {
        throw new Error('Model should be defined for this template');
      }
      return this._path(model, template);
    } else {
      return this._pathForAll(template);
    }
  }

  /**
   * Returns the input(s) that will be injected in a template
   *
   * @param {IModel|null} model
   * @returns {Promise<any|any[]>}
   */
  inputs(model: IModel|null = null): Promise<any|any[]> {
    if (model) {
      return this._explicitModel(model);
    } else {
      return this._explicitAllModels();
    }
  }

  /**
   * Run generation process for one model
   *
   * @param {ITemplate} template
   * @param {IModel} model
   * @returns {Promise<IGeneratorResult>}
   * @throws {Error}
   *  If the template rendering engine is unknown
   * @private
   */
  private async _one(template: ITemplate, model: IModel): Promise<IGeneratorResult> {

    // Compute path
    const path = this._path(model, template);
    // Get full model description
    const input = await this._explicitModel(model);

    // Compute content
    let content;
    if (template.engine === TemplateEngine.doT) {
      content = await this.dotGeneratorService.one(input, template);
    } else if (template.engine === TemplateEngine.JavaScript) {
      content = await this.javaScriptGeneratorService.one(input, template);
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
   * @throws {Error}
   *  If the template rendering engine is unknowns
   * @private
   */
  private async _all(template: ITemplate): Promise<IGeneratorResult> {

    // Compute path
    const path = this._pathForAll(template);
    // Get full models description
    const input = await this._explicitAllModels();

    // Compute content
    let content;
    if (template.engine === TemplateEngine.doT) {
      content = await this.dotGeneratorService.all(input, template);
    } else if (template.engine === TemplateEngine.JavaScript) {
      content = await this.javaScriptGeneratorService.all(input, template);
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
   * @throws {Error}
   *  If no content was generated
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
   * Compute path for a "one model" template
   *
   * @param {IModel} model
   * @param {ITemplate} template
   * @returns {string}
   * @private
   */
  private _path(model: IModel, template: ITemplate): string {

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
   * Compute path for a "all model" template
   *
   * @param {ITemplate} template
   * @returns {string}
   * @private
   */
  private _pathForAll(template: ITemplate): string {
    return template.path;
  }

  /**
   * Convert the model to an object containing all its properties
   *
   * @todo Use caching for this method
   * @param {IModel} model
   * @param {number} depth
   * @return {Promise<any>}
   * @private
   */
  private async _explicitModel(model: IModel, depth = 0): Promise<any> {

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

    // Get unique fields
    const unique = fields.filter((f) => f.unique);

    // Get searchable fields
    const searchable = fields.filter((f) => f.searchable);

    // Get sortable fields
    const sortable = fields.filter((f) => f.sortable);

    // Get private fields
    const isPrivate = fields.filter((f) => f.isPrivate);

    // Get internal fields
    const internal = fields.filter((f) => f.internal);

    // Create filter function
    const filter = (func = null) => {
      return typeof func === 'function' ?
        fields.filter(func) : fields;
    };

    // Set fields to model
    m.fields = {
      list: fields,
      l: fields,
      f: filter,
      filter,
      primary,
      p: primary,
      unique,
      u: unique,
      searchable,
      se: searchable,
      sortable,
      so: sortable,
      isPrivate,
      ip: isPrivate,
      internal,
      i: internal
    };

    // Add references and dependencies on first level
    if (depth === 0) {

      //==========================================
      // REFERENCES
      //==========================================
      // Construct promises
      // Then explicit the reference. If no reference is found returns null (it will be filtered after)
      const promisesRef = fields.filter((f) => (f.type === FieldType.Entity) && f.reference)
        .map((field) => {
          return this.modelStorageService.find(field.reference)
            .then(async (reference) => {
              // Nothing found
              if (!reference) {
                return null;
              }
              // Add reference to object
              const subField = await this._explicitModel(reference, depth + 1);
              field.model = subField;
              field.m = subField;

              return field;
            });
        });

      // Get reference fields
      const references = (await Promise.all(promisesRef)).filter((f) => f);

      // Add to object
      m.fields.references = references;
      m.fields.references.f = m.fields.references.filter;
      m.fields.r = references;
      m.fields.r.f = m.fields.r.filter;

      //==========================================
      // DEPENDENCIES
      //==========================================
      // Create method to reduce references to dependencies
      // A custom filter can be passed
      // If the second argument is false, keep the self dependency
      const dependencies = (customFilter = f => f, removeSelf: boolean = true) => {
        const duplicates = {};
        return references
          // Apply custom filter
          .filter(customFilter)
          // Remove self
          .filter((ref: any) => removeSelf ? ref.model.id !== model.id : true)
          // Remove duplicates
          .filter((ref: any) => {
            if (duplicates[ref.reference] === true) return false;
            duplicates[ref.reference] = true;
            return true;
          })
          // Extract models
          .map((ref: any) => ref.model);
      };

      // A boolean to determine if the model has a self dependency
      const selfDependency = !!references.find((ref: any) => ref.model.id === model.id);

      const allDependencies = dependencies();
      m.dependencies = {
        list: allDependencies,
        l: allDependencies,
        filter: dependencies,
        f: dependencies,
        self: selfDependency,
        s: selfDependency
      };
      m.d = m.dependencies;

      //==========================================
      // REFERENCED IN
      //==========================================
      // Parse all models and find where it as been referenced
      const models = await this.modelStorageService.list();
      // Filter referencing models
      const extractReferencingFields = (f: IField) => f.type === FieldType.Entity && f.reference === model.id;
      const promisesIn = models
        .filter((m: IModel) => !!m.fields.find(extractReferencingFields))
        .map(async (m: IModel) => {
          // Get model description (first level) and remove non referencing fields
          const explicited = await this._explicitModel(m, depth + 1);
          explicited.fields = explicited.fields.list.filter(extractReferencingFields);
          explicited.f = explicited.fields;
          return explicited;
        });
      // Get all results
      const referencedIn = await Promise.all(promisesIn);
      m.referencedIn = referencedIn;
      m.ri = referencedIn;
    }

    // Add short name
    m.f = m.fields;

    return m;
  }

  /**
   * Convert all the models to an array of objects containing all its properties
   *
   * @return {Promise<any[]>}
   * @private
   */
  private async _explicitAllModels(): Promise<any[]> {
    return await Promise.all((await this.modelStorageService.list())
      .map( (mod: IModel) => this._explicitModel(mod)));
  }
}
