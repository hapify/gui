import {IField, IFieldBase} from './field';

export interface IModelBase {
  /**
   * The model's name
   *
   * @type {string}
   */
  name: string;
  /**
   * The fields of the model
   *
   * @type {IFieldBase[]}
   */
  fields: IFieldBase[];
}

export interface IModel extends IModelBase {
  /**
   * The fields of the model
   *
   * @type {IField[]}
   */
  fields: IField[];
  /**
   * Convert the instance to an object
   *
   * @returns {IModelBase}
   */
  toObject(): IModelBase;
  /**
   * Bind properties from the base object to this object
   *
   * @param {IModelBase} object
   * @returns {void}
   */
  fromObject(object: IModelBase): void;
  /**
   * Denotes if the field should be considered as empty
   *
   * @returns {boolean}
   */
  isEmpty(): boolean;
  /**
   * Returns a new field instance
   *
   * @returns {IField}
   */
  newField(): IField;
  /**
   * Push a new field
   *
   * @param {IField} field
   * @returns {void}
   */
  addField(field: IField): void;
  /**
   * Transform the model into a string
   *
   * @returns {string}
   */
  serialize(): string;
  /**
   * Populate the instance from the string data
   *
   * @param {string} data
   * @returns {void}
   */
  unserialize(data: string): void;
  /**
   * Remove empty fields
   *
   * @returns {void}
   */
  filter(): void;
}
