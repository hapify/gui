import {TemplateType} from './template-type.enum';

export interface ITemplateBase {
  /**
   * The template's name
   *
   * @type {string}
   */
  name: string;
  /**
   * The template's type
   *
   * @type {TemplateType}
   */
  type: TemplateType;
  /**
   * Should be used as a primary key or not
   *
   * @type {boolean}
   */
  primary: boolean;
  /**
   * Indicate whether the template is searchable or not
   *
   * @type {boolean}
   */
  searchable: boolean;
  /**
   * Indicate whether the template is sortable or not
   *
   * @type {boolean}
   */
  sortable: boolean;
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
