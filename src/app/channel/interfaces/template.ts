import {TemplateEngine} from './template-engine.enum';

export interface ITemplateBase {
  /**
   * The template's path
   *
   * @type {string}
   */
  path: string;
  /**
   * The template's type
   *
   * @type {TemplateEngine}
   */
  engine: TemplateEngine;
  /**
   * The template's content
   *
   * @type {string}
   */
  content: string;
}

export interface ITemplate extends ITemplateBase {
  /**
   * Convert the instance to an object
   *
   * @returns {ITemplateBase}
   */
  toObject(): ITemplateBase;
  /**
   * Bind properties from the base object to this object
   *
   * @param {ITemplateBase} object
   * @returns {void}
   */
  fromObject(object: ITemplateBase): void;
  /**
   * Denotes if the template should be considered as empty
   *
   * @returns {boolean}
   */
  isEmpty(): boolean;
}
