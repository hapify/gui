import { Component, OnInit, Input } from '@angular/core';
import { IField } from '../../interfaces/field';
import { FieldType } from '../../classes/field-type';
import { IModel } from '../../interfaces/model';
import { ILabelledValue } from '@app/model/interfaces/labelled-value';

interface IPropertyIcon {
	property: string;
	icon: string;
	value: boolean;
}

@Component({
	selector: 'app-model-field-light',
	templateUrl: './field-light.component.html',
	styleUrls: ['../field/field.component.scss']
})
export class FieldLightComponent implements OnInit {
	/** Constructor */
	constructor() {}

	/** @type {IModel[]} Available Models */
	@Input() models: IModel[];
	/** @type {IField} New field instance */
	@Input() field: IField;
	/** Link to FieldType class */
	fieldType = FieldType;
	/** Availables types */
	types = this.fieldType.list();
	/** Availables subtypes */
	subtypes: ILabelledValue[] = [];

	propertiesIcons: IPropertyIcon[] = [
		{ property: 'primary', icon: 'vpn_key', value: false },
		{ property: 'unique', icon: 'star', value: false },
		{ property: 'label', icon: 'label', value: false },
		{ property: 'nullable', icon: 'backspace', value: false },
		{ property: 'multiple', icon: 'list', value: false },
		{ property: 'embedded', icon: 'link', value: false },
		{ property: 'searchable', icon: 'search', value: false },
		{ property: 'sortable', icon: 'filter_list', value: false },
		{ property: 'hidden', icon: 'visibility_off', value: false },
		{ property: 'internal', icon: 'code', value: false },
		{ property: 'restricted', icon: 'pan_tool', value: false },
		{ property: 'ownership', icon: 'copyright', value: false }
	];
	filteredPropertiesIcons: IPropertyIcon[] = [];

	/**
	 * @inheritDoc
	 */
	ngOnInit() {
		this.updatePropertiesIcons();
		this.subtypes = this.field.getAvailableSubTypes();
	}

	/**
	 * Get the model name for an entity reference
	 *
	 * @param {IField} field
	 * @return {string|null}
	 */
	getModelName(field: IField) {
		if (field.type !== FieldType.Entity || !this.models) {
			return null;
		}
		const model = this.models.find(m => m.id === field.reference);
		return model ? model.name : '-';
	}

	/** Get the icon for the selected field */
	updatePropertiesIcons(): void {
		for (const p of this.propertiesIcons) {
			p.value = !!this.field[p.property];
		}
		this.filteredPropertiesIcons = this.propertiesIcons.filter(
			i => i.value
		);
	}
}
