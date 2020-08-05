import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ILabelledValue } from '@app/model/interfaces/labelled-value';
import { FieldLightComponent } from '../field-light/field-light.component';

@Component({
	selector: 'app-model-field',
	templateUrl: './field.component.html',
	styleUrls: ['./field.component.scss'],
})
export class FieldComponent extends FieldLightComponent implements OnInit, OnDestroy {
	/** Rows deletion mode */
	@Input() deletionMode = false;
	/** Notify changes */
	@Output() update = new EventEmitter<void>();
	/** Request for delete field */
	@Output() delete = new EventEmitter<void>();

	isTypesTooltipDisplayed = false;
	isSubtypesTooltipDisplayed = false;
	isNotesTooltipDisplayed = false;

	fieldOvered = 'generic';
	isFieldsTooltipDisplayed = false;
	noSelectedField = false;

	ngOnInit(): void {
		super.ngOnInit();
		this.areSelectedFields();
	}

	/** Destroy */
	ngOnDestroy(): void {}

	/** Called when a value change */
	onInputChange(): void {
		this.updateField();
		this.update.emit();
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

	/** Detect if at least one field attribute has been defined */
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
	toggleSubtypesTooltip(type: ILabelledValue): void {
		this.isSubtypesTooltipDisplayed = type.value !== 'boolean';
	}
}
