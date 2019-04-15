import { IField, IFieldBase } from './field';
import { IStorableBase, IStorable } from '../../interfaces/storable';
import { IAccesses } from './access';

export interface IModelBase extends IStorableBase {
	/**
	 * The model's name
	 *
	 * @type {string}
	 */
	name: string;
	/**
	 * The model's notes
	 *
	 * @type {string}
	 */
	notes?: string;
	/**
	 * The fields of the model
	 *
	 * @type {IFieldBase[]}
	 */
	fields: IFieldBase[];
	/**
	 * The model privacy access
	 *
	 * @type IAccesses
	 */
	accesses: IAccesses;
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
	 * Remove a field
	 *
	 * @param {IField} field
	 * @returns {void}
	 */
	removeField(field: IField): void;

	/**
	 * Push a new field
	 *
	 * @param {IField} field
	 * @param {number} indexDelta
	 * @returns {void}
	 */
	moveField(field: IField, indexDelta: number): void;

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
	 * Clone the model to a new reference
	 *
	 * @returns {IModel}
	 */
	clone(): IModel;
}
