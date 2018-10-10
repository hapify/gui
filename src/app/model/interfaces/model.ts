import {IField, IFieldBase} from './field';
import {IStorableBase, IStorable} from '../../interfaces/storable';
import {IContexts} from './context';

export interface IModelBase extends IStorableBase {
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
  /**
   * The model privacy context
   *
   * @type IContexts
   */
  contexts: IContexts;
}

export interface IModel extends IModelBase, IStorable {
  /**
   * The fields of the model
   *
   * @type {IField[]}
   */
  fields: IField[];

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
   * Remove empty fields
   *
   * @returns {void}
   */
  filter(): void;

  /**
   * Convert the instance to an object
   *
   * @returns {IModelBase}
   */
  toObject(): IModelBase;

  /**
   * Clone the model with a new id
   *
   * @returns {IModel}
   */
  clone(): IModel;
}
