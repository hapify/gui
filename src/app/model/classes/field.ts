import { IField, IFieldBase } from '../interfaces/field';
import { ILabelledValue } from '../interfaces/labelled-value';
import { FieldType } from './field-type';
import { FieldSubType } from './field-subtype';

export class Field implements IField {
	/** Constructor */
	constructor() {}

	/** @inheritDoc */
	public name = '';
	/** @type {string} The field's notes */
	public notes: string;
	/** @inheritDoc */
	public type = FieldType.String;
	/** @inheritDoc */
	public subtype = FieldSubType.String.Default;
	/** @inheritDoc */
	public reference = null;
	/** @inheritDoc */
	public primary = false;
	/** @inheritDoc */
	public unique = false;
	/** @inheritDoc */
	public label = false;
	/** @inheritDoc */
	public nullable = false;
	/** @inheritDoc */
	public multiple = false;
	/** @inheritDoc */
	public embedded = false;
	/** @inheritDoc */
	public searchable = false;
	/** @inheritDoc */
	public sortable = false;
	/** @inheritDoc */
	public hidden = false;
	/** @inheritDoc */
	public internal = false;
	/** @inheritDoc */
	public restricted = false;
	/** @inheritDoc */
	public ownership = false;

	/** @inheritDoc */
	public fromObject(object: IFieldBase): void {
		this.name = object.name;
		this.notes = object.notes || null;
		this.type = object.type;
		this.subtype = object.subtype;
		this.reference = object.reference;
		this.primary = !!(object.primary as any);
		this.unique = !!(object.unique as any);
		this.label = !!(object.label as any);
		this.nullable = !!(object.nullable as any);
		this.multiple = !!(object.multiple as any);
		this.embedded = !!(object.embedded as any);
		this.searchable = !!(object.searchable as any);
		this.sortable = !!(object.sortable as any);
		this.hidden = !!(object.hidden as any);
		this.internal = !!(object.internal as any);
		this.restricted = !!(object.restricted as any);
		this.ownership = !!(object.ownership as any);
	}

	/** @inheritDoc */
	public toObject(): IFieldBase {
		return {
			name: this.name,
			notes: this.notes || null,
			type: this.type,
			subtype: this.subtype,
			reference: this.type === FieldType.Entity ? this.reference : null,
			primary: this.primary,
			unique: this.unique,
			label: this.label,
			nullable: this.nullable,
			multiple: this.multiple,
			embedded: this.embedded,
			searchable: this.searchable,
			sortable: this.sortable,
			hidden: this.hidden,
			internal: this.internal,
			restricted: this.restricted,
			ownership: this.ownership,
		};
	}

	/** @inheritDoc */
	public isEmpty(): boolean {
		const empty = typeof this.name !== 'string' || this.name === null || this.name.trim().length === 0;
		return empty;
	}

	/**
	 * Get the available sub types for the current type
	 *
	 * @return {ILabelledValue[]}
	 */
	public getAvailableSubTypes(): ILabelledValue[] {
		if (this.type === FieldType.String) {
			return FieldSubType.string();
		}
		if (this.type === FieldType.Number) {
			return FieldSubType.number();
		}
		if (this.type === FieldType.Boolean) {
			return FieldSubType.boolean();
		}
		if (this.type === FieldType.DateTime) {
			return FieldSubType.datetime();
		}
		if (this.type === FieldType.Entity) {
			return FieldSubType.entity();
		}
		if (this.type === FieldType.Object) {
			return FieldSubType.object();
		}
		if (this.type === FieldType.File) {
			return FieldSubType.file();
		}
		return [];
	}
}
