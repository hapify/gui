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
import { Field } from '@app/model/classes/field';
import { ILabelledValue } from '@app/model/interfaces/labelled-value';

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

	/** @type {IField} New field instance */
	@Input() field: IField;
	/** @type {boolean} Rows deletion mode */
	@Input() cleanRows = false;
	/** @type {EventEmitter<void>} Notify changes */
	@Output() change = new EventEmitter<void>();
	/** @type {EventEmitter<void>} Request for move up */
	@Output() moveUp = new EventEmitter<void>();
	/** @type {EventEmitter<void>} Request for move down */
	@Output() moveDown = new EventEmitter<void>();
	/** @type {EventEmitter<void>} Request for clean row */
	@Output() cleanRow = new EventEmitter<void>();
	/** @type {FormGroup} */
	form: FormGroup;
	/** @type {number} */
	minLength = 1;
	/** @type {number} */
	maxLength = 64;
	/** @type {{minLength: number; maxLength: number}} */
	translateParams = {
		minLength: this.minLength,
		maxLength: this.maxLength
	};
	/** Link to FieldType class */
	fieldType = FieldType;
	/** Availables types */
	types = this.fieldType.list();
	/** Availables subtypes */
	subtypes: ILabelledValue[] = [];
	/** Available models */
	models: IModel[];

	isTypesTooltipDisplayed = false;
	isSubtypesTooltipDisplayed = false;

	/** Available fields */
	fields = new Field();
	availableFields = Object.keys(this.fields);
	fieldOvered = 'generic';
	isFieldsTooltipDisplayed = false;
	noSelectedField = false;

	/**
	 * @inheritDoc
	 */
	ngOnInit() {
		// Get available models
		this.storageService.list().then(models => {
			this.models = models;
		});
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

		this.subtypes = this.field.getAvailableSubTypes();
		this.areSelectedFields();
	}

	/**
	 * Destroy
	 */
	ngOnDestroy() {}

	/**
	 * Called when a value change
	 */
	onInputChange() {
		this.updateModel();
		this.change.emit();
	}

	/**
	 * Called when the user clicks on up
	 */
	onUp() {
		this.updateModel();
		this.moveUp.emit();
	}

	/**
	 * Called when the user clicks on up
	 */
	onDown() {
		this.updateModel();
		this.moveDown.emit();
	}

	/** Update models properties from inputs values */
	private updateModel(): void {
		for (const key of Object.keys(this.form.controls)) {
			this.field[key] = this.form.get(key).value;
		}
		this.subtypes = this.field.getAvailableSubTypes();
		this.areSelectedFields();
	}

	/**Detect if at least one field attribute has been defined*/
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

	cleanField(): void {
		this.form.patchValue({ name: null });
		this.updateModel();
		this.cleanRow.emit();
	}
}
