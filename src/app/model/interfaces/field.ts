import {ILabelledValue} from './labelled-value';

export interface IFieldBase {
  /** @type {string} The field's name */
  name: string;
  /** @type {string} The field's type */
  type: string;
  /** @type {string} The field's subtype */
  subtype: string | null;
  /** @type {string} The field's reference if the type is entity. The GUID string of the targeted model */
  reference: string | null;
  /** @type {boolean} Should be used as a primary key or not */
  primary: boolean;
  /** @type {boolean} Should be used as a unique key or not */
  unique: boolean;
  /** @type {boolean} Should be used as a label or not */
  label: boolean;
  /** @type {boolean} Denotes if the field can be empty or not */
  nullable: boolean;
  /** @type {boolean} Denotes if the field is an array of values */
  multiple: boolean;
  /** @type {boolean} Indicate whether the field is important (should be always exposed explicitly) */
  important: boolean;
  /** @type {boolean} Indicate whether the field is searchable or not */
  searchable: boolean;
  /** @type {boolean} Indicate whether the field is sortable or not */
  sortable: boolean;
  /** @type {boolean} Indicate whether the field is private (should not be exposed) */
  isPrivate: boolean;
  /** @type {boolean} Indicate whether the field is for an internal use only (should not be defined by an user) */
  internal: boolean;
  /** @type {boolean} Indicate whether the field is restricted to authorized roles (should only be defined by an admin) */
  restricted: boolean;
  /** @type {boolean} Indicate that this field defines the owner of the entity */
  ownership: boolean;
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
