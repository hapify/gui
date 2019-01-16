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
import { IModel } from '../../interfaces/model';
import { Access } from '../../interfaces/access';
import { ILabelledValue } from '../../interfaces/labelled-value';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Field } from '@app/model/classes/field';

interface IAccessValue {
	selected: boolean;
	value: ILabelledValue;
}
interface IActionValue {
	name: string;
	accesses: IAccessValue[];
}

/** Store accesses indexes */
const AccessesIndex = {
	[Access.ADMIN]: 0,
	[Access.OWNER]: 1,
	[Access.AUTHENTICATED]: 2,
	[Access.GUEST]: 3
};
/** Store available accesses */
const Accesses: ILabelledValue[] = [
	{ name: 'Admin', value: Access.ADMIN },
	{ name: 'Owner', value: Access.OWNER },
	{ name: 'Authenticated', value: Access.AUTHENTICATED },
	{ name: 'Guest', value: Access.GUEST }
];

@Component({
	selector: 'app-model-model',
	templateUrl: './model.component.html',
	styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit, OnDestroy {
	/**
	 * Constructor
	 */
	constructor(
		private formBuilder: FormBuilder,
		private hotKeysService: HotkeysService
	) {}

	/** @type {IModel} Model instance */
	@Input() model: IModel;
	/** @type {IModel[]} Available Models */
	@Input() models: IModel[];
	/** @type {EventEmitter<void>} Notify save */
	@Output() save = new EventEmitter<IModel>();
	/** @type {EventEmitter<void>} Notify changes */
	@Output() change = new EventEmitter<void>();
	/** @type {EventEmitter<void>} Notify cloning */
	@Output() clone = new EventEmitter<void>();
	/** @type {EventEmitter<void>} Notify deletion */
	@Output() delete = new EventEmitter<void>();
	/** @type {FormGroup} */
	form: FormGroup;
	/** @type {number} */
	minLength = 2;
	/** @type {number} */
	maxLength = 32;
	/** @type {boolean} Denotes if the user has unsaved changes (to prevent reload) */
	unsavedChanges = false;
	/** @type{Hotkey|Hotkey[]} Hotkeys to unbind */
	private saveHotKeys: Hotkey | Hotkey[];
	/** @type {IActionValue[]} List available actions */
	actions: IActionValue[] = [];

	accessRightsPannelIsDisplayed = false;
	cleanRows = false;
	confirmModelDeletion = false;

	/**
	 * @inheritDoc
	 */
	ngOnInit() {
		// Form validator
		this.form = this.formBuilder.group({
			name: new FormControl(this.model.name, [
				Validators.required,
				Validators.minLength(this.minLength),
				Validators.maxLength(this.maxLength)
			])
		});
		// Save on Ctrl+S
		this.saveHotKeys = this.hotKeysService.add(
			new Hotkey(
				'meta+s',
				(event: KeyboardEvent): boolean => {
					this.submit();
					return false;
				}
			)
		);
		// Get available actions
		this.updateActions();
	}

	/**
	 * Destroy
	 */
	ngOnDestroy() {
		this.hotKeysService.remove(this.saveHotKeys);
	}

	/**
	 * Called when the user click on "save"
	 */
	submit() {
		this.updateModel();
		this.save.emit(this.model);
		this.unsavedChanges = false;
	}

	/**
	 * Called when the user click on "add field"
	 */
	addField() {
		this.model.addField(this.model.newField());
		this.onModelChange();
	}

	/**
	 * Called when the user click on "clean fields"
	 */
	deleteField(field: Field) {
		this.model.removeField(field);
		this.onModelChange();
	}

	/**
	 * Called when a field change
	 */
	onModelChange() {
		this.change.emit();
		this.unsavedChanges = true;
		this.submit();
		this.updateActions();
	}

	/**
	 * Called when the user changes a access
	 */
	onAccessChange(action: string, access: ILabelledValue): void {
		this.model.accesses[action] = access.value;
		this.onModelChange();
	}
	/**
	 * Denotes if the access should be highlighted
	 * @return {boolean}
	 */
	private isAccessSelected(action: string, access: ILabelledValue): boolean {
		return (
			AccessesIndex[this.model.accesses[action]] >=
			AccessesIndex[access.value]
		);
	}

	/** Update models properties from inputs values */
	private updateModel(): void {
		for (const key of Object.keys(this.form.controls)) {
			this.model[key] = this.form.get(key).value;
		}
	}

	/** Compute actions selected actions for this model */
	private updateActions(): void {
		console.log('yo');
		this.actions = Object.keys(this.model.accesses).map(
			(action: string): IActionValue => {
				return {
					name: action,
					accesses: Accesses.map(access => ({
						selected: this.isAccessSelected(action, access),
						value: access
					}))
				};
			}
		);
	}

	/** Drag and drop fields list */
	dropped(event: CdkDragDrop<string[]>) {
		this.model.moveField(
			this.model.fields[event.previousIndex],
			event.currentIndex - event.previousIndex
		);
		this.onModelChange();
	}
}
