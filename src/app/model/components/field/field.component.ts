import {
	Component,
	OnInit,
	OnDestroy,
	Input,
	Output,
	EventEmitter
} from '@angular/core';
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
	selector: 'app-model-field',
	templateUrl: './field.component.html',
	styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit, OnDestroy {
	/** Constructor */
	constructor() {}

	/** @type {IModel[]} Available Models */
	@Input() models: IModel[];
	/** @type {IField} New field instance */
	@Input() field: IField;
	/** @type {boolean} Rows deletion mode */
	@Input() deletionMode = false;
	/** @type {EventEmitter<void>} Notify changes */
	@Output() change = new EventEmitter<void>();
	/** @type {EventEmitter<void>} Request for delete field */
	@Output() delete = new EventEmitter<void>();
	/** Link to FieldType class */
	fieldType = FieldType;
	/** Availables types */
	types = this.fieldType.list();
	/** Availables subtypes */
	subtypes: ILabelledValue[] = [];

	isTypesTooltipDisplayed = false;
	isSubtypesTooltipDisplayed = false;

	fieldOvered = 'generic';
	isFieldsTooltipDisplayed = false;
	noSelectedField = false;

	propertiesIcons: IPropertyIcon[] = [
		{ property: 'primary', icon: 'vpn_key', value: false },
		{ property: 'unique', icon: 'star', value: false },
		{ property: 'label', icon: 'label', value: false },
		{ property: 'nullable', icon: 'backspace', value: false },
		{ property: 'multiple', icon: 'list', value: false },
		{ property: 'important', icon: 'error_outline', value: false },
		{ property: 'searchable', icon: 'search', value: false },
		{ property: 'sortable', icon: 'filter_list', value: false },
		{ property: 'isPrivate', icon: 'lock', value: false },
		{ property: 'internal', icon: 'code', value: false },
		{ property: 'restricted', icon: '', value: false },
		{ property: 'ownership', icon: 'copyright', value: false }
	];
	filteredPropertiesIcons: IPropertyIcon[] = [];

	/**
	 * @inheritDoc
	 */
	ngOnInit() {
		this.updatePropertiesIcons();
		this.subtypes = this.field.getAvailableSubTypes();
		this.areSelectedFields();
	}

	/** Destroy */
	ngOnDestroy() {}

	/** Called when a value change */
	onInputChange() {
		this.updateField();
		this.change.emit();
	}

	/** Called when the user delete the field */
	onDelete(): void {
		this.delete.emit();
	}

	/** Update models properties from inputs values */
	private updateField(): void {
		this.updatePropertiesIcons();
		this.subtypes = this.field.getAvailableSubTypes();
		this.areSelectedFields();
	}

	/** Detect if at least one field attribute has been defined*/
	private areSelectedFields(): void {
		this.noSelectedField = true;
		for (const pi of this.propertiesIcons) {
			if (this.field[pi.property]) {
				this.noSelectedField = false;
				break;
			}
		}
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

	/** Display subtypes in tooltip */
	toggleSubtypesTooltip(type: ILabelledValue) {
		this.isSubtypesTooltipDisplayed = type.value !== 'boolean';
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
