import {ILabelledValue} from './labelled-value';

export interface IFieldBase {
  /**
   * The field's name
   *
   * @type {string}
   */
  name: string;
  /**
   * The field's type
   *
   * @type {string}
   */
  type: string;
  /**
   * The field's subtype
   *
   * @type {string}
   */
  subtype: string|null;
  /**
   * The field's reference if the type is entity
   * Is the GUID string of the targeted model
   *
   * @type {string}
   */
  reference: string;
  /**
   * Should be used as a primary key or not
   *
   * @type {boolean}
   */
  primary: boolean;
  /**
   * Should be used as a unique key or not
   *
   * @type {boolean}
   */
  unique: boolean;
  /**
   * Should be used as a label or not
   *
   * @type {boolean}
   */
  label: boolean;
  /**
   * Denotes if the field can be empty or not
   *
   * @type {boolean}
   */
  nullable: boolean;
  /**
   * Denotes if the field is an array of values
   *
   * @type {boolean}
   */
  multiple: boolean;
  /**
   * Indicate whether the field is searchable or not
   *
   * @type {boolean}
   */
  searchable: boolean;
  /**
   * Indicate whether the field is sortable or not
   *
   * @type {boolean}
   */
  sortable: boolean;
  /**
   * Indicate whether the field is private (should not be exposed)
   *
   * @type {boolean}
   */
  isPrivate: boolean;
  /**
   * Indicate whether the field is for an internal use only (should not be defined by an user)
   *
   * @type {boolean}
   */
  internal: boolean;
}

export interface IField extends IFieldBase {
  /**
   * Convert the instance to an object
   *
   * @returns {IFieldBase}
   */
  toObject(): IFieldBase;
  /**
   * Bind properties from the base object to this object
   *
   * @param {IFieldBase} object
   * @returns {void}
   */
  fromObject(object: IFieldBase): void;
  /**
   * Denotes if the field should be considered as empty
   *
   * @returns {boolean}
   */
  isEmpty(): boolean;
  /**
   * Get the available subtypes corresponding to the type
   *
   * @returns {ILabelledValue[]}
   */
  getAvailableSubTypes(): ILabelledValue[];
}
