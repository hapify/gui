import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ILabelledValue } from '@app/model/interfaces/labelled-value';
import { FieldLightComponent } from '../field-light/field-light.component';

@Component({
	selector: 'app-model-field',
	templateUrl: './field.component.html',
	styleUrls: ['./field.component.scss'],
})
export class FieldComponent extends FieldLightComponent implements OnInit, OnDestroy {
	/** @type {boolean} Rows deletion mode */
	@Input() deletionMode = false;
	/** @type {EventEmitter<void>} Notify changes */
	@Output() change = new EventEmitter<void>();
	/** @type {EventEmitter<void>} Request for delete field */
	@Output() delete = new EventEmitter<void>();

	isTypesTooltipDisplayed = false;
	isSubtypesTooltipDisplayed = false;
	isNotesTooltipDisplayed = false;

	fieldOvered = 'generic';
	isFieldsTooltipDisplayed = false;
	noSelectedField = false;

	/**
	 * @inheritDoc
	 */
	ngOnInit() {
		super.ngOnInit();
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

	/** Display subtypes in tooltip */
	toggleSubtypesTooltip(type: ILabelledValue) {
		this.isSubtypesTooltipDisplayed = type.value !== 'boolean';
	}
}
