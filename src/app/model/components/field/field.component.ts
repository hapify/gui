import {
	Component,
	OnInit,
	OnDestroy,
	Input,
	Output,
	EventEmitter
} from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	FormControl,
	Validators
} from '@angular/forms';
import { StorageService } from '../../services/storage.service';
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
	/**
	 * Constructor
	 *
	 * @param storageService
	 * @param formBuilder
	 */
	constructor(
		private storageService: StorageService,
		private formBuilder: FormBuilder
	) {}

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
	/** @type {FormGroup} */
	form: FormGroup;
	/** @type {number} */
	minLength = 1;
	/** @type {number} */
	maxLength = 64;
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
		// Form validator
		this.form = this.formBuilder.group({
			name: new FormControl(this.field.name, [
				Validators.minLength(this.minLength),
				Validators.maxLength(this.maxLength)
			]),
			type: new FormControl(this.field.type, [Validators.required]),
			subtype: new FormControl(this.field.subtype, []),
			reference: new FormControl(this.field.reference, [
				Validators.required
			]),
			primary: new FormControl(this.field.primary, [Validators.required]),
			unique: new FormControl(this.field.unique, [Validators.required]),
			label: new FormControl(this.field.label, [Validators.required]),
			nullable: new FormControl(this.field.nullable, [
				Validators.required
			]),
			multiple: new FormControl(this.field.multiple, [
				Validators.required
			]),
			important: new FormControl(this.field.important, [
				Validators.required
			]),
			searchable: new FormControl(this.field.searchable, [
				Validators.required
			]),
			sortable: new FormControl(this.field.sortable, [
				Validators.required
			]),
			isPrivate: new FormControl(this.field.isPrivate, [
				Validators.required
			]),
			internal: new FormControl(this.field.internal, [
				Validators.required
			]),
			restricted: new FormControl(this.field.restricted, [
				Validators.required
			]),
			ownership: new FormControl(this.field.ownership, [
				Validators.required
			])
		});

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
		for (const key of Object.keys(this.form.controls)) {
			this.field[key] = this.form.get(key).value;
		}
		this.updatePropertiesIcons();
		this.subtypes = this.field.getAvailableSubTypes();
		this.areSelectedFields();
	}

	/** Detect if at least one field attribute has been defined*/
	private areSelectedFields(): void {
		this.noSelectedField = true;
		for (const key of Object.keys(this.form.controls)) {
			if (
				key !== 'name' &&
				key !== 'type' &&
				key !== 'subtype' &&
				key !== 'reference' &&
				this.field[key]
			) {
				this.noSelectedField = false;
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
