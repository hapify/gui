import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Output,
	ViewChild
} from '@angular/core';
import { Model } from '../../classes/model';
import { IModel } from '../../interfaces/model';

@Component({
	selector: 'app-model-new',
	templateUrl: './new.component.html',
	styleUrls: ['./new.component.scss']
})
export class NewComponent implements AfterViewInit {
	/**
	 * Constructor
	 */
	constructor() {}

	public name = '';

	/** @type {EventEmitter<void>} Notify save */
	@Output() create = new EventEmitter<IModel>();

	@ViewChild('nameInput') nameInput: ElementRef;

	ngAfterViewInit() {
		// Avoid "Expression has changed after it was checked" error
		setTimeout(() => this.nameInput.nativeElement.focus());
	}

	/**
	 * Called when the user save the new model
	 */
	save() {
		// Create new model
		const model = new Model();
		model.name = this.name;

		// Default field(s)
		const primary = model.newField();
		primary.name = '_id';
		primary.primary = true;
		primary.internal = true;
		model.addField(primary);

		const creation = model.newField();
		creation.name = 'created_at';
		creation.type = 'datetime';
		creation.internal = true;
		creation.sortable = true;
		model.addField(creation);

		// Send the model
		this.create.emit(model);
	}
}
