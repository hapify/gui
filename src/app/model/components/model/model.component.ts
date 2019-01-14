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
import { Field } from '../../classes/field';
import { StorageService } from '@app/model/services/storage.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
		private hotKeysService: HotkeysService,
		private storageService: StorageService
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
	/** @type {{minLength: number; maxLength: number}} */
	translateParams = {
		minLength: this.minLength,
		maxLength: this.maxLength
	};
	/** @type {boolean} Denotes if the user has unsaved changes (to prevent reload) */
	unsavedChanges = false;
	/** @type{Hotkey|Hotkey[]} Hotkeys to unbind */
	private saveHotKeys: Hotkey | Hotkey[];
	/** @type {ILabelledValue[]} Available accesses */
	accesses: ILabelledValue[] = [
		{ name: 'Admin', value: Access.ADMIN },
		{ name: 'Owner', value: Access.OWNER },
		{ name: 'Authenticated', value: Access.AUTHENTICATED },
		{ name: 'Guest', value: Access.GUEST }
	];

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
	 * Called when the user clicks on up
	 */
	onFieldUp(field: Field) {
		this.model.moveField(field, -1);
		this.onModelChange();
	}

	/**
	 * Called when the user clicks on up
	 */
	onFieldDown(field: Field) {
		this.model.moveField(field, 1);
		this.onModelChange();
	}

	/**
	 * Called when the user click on "clean fields"
	 */
	cleanFields() {
		this.model.filter();
		this.onModelChange();
	}

	/**
	 * Called when a field change
	 */
	onModelChange() {
		this.change.emit();
		this.unsavedChanges = true;
		this.submit();
	}

	/**
	 * Called when the user changes a access
	 */
	onAccessChange(action: string, access: ILabelledValue): void {
		this.model.accesses[action] = access.value;
		this.onModelChange();
	}
	/**
	 * Get available actions for this model
	 * @return {string[]}
	 */
	getActions(): string[] {
		return Object.keys(this.model.accesses);
	}
	/**
	 * Denotes if the access should be highlighted
	 * @return {boolean}
	 */
	isAccesseselected(action: string, access: ILabelledValue): boolean {
		return (
			this.accessPosition(this.model.accesses[action]) >=
			this.accessPosition(access.value)
		);
	}

	/**
	 * Get the position in importance
	 * @param name
	 * @return {number}
	 */
	accessPosition(name): number {
		if (name === Access.ADMIN) {
			return 0;
		}
		if (name === Access.OWNER) {
			return 1;
		}
		if (name === Access.AUTHENTICATED) {
			return 2;
		}
		if (name === Access.GUEST) {
			return 3;
		}
		return -1;
	}

	/** Update models properties from inputs values */
	private updateModel(): void {
		for (const key of Object.keys(this.form.controls)) {
			this.model[key] = this.form.get(key).value;
		}
	}

	/** Drag and drop fields list */
	dropped(model: IModel, event: CdkDragDrop<string[]>) {
		moveItemInArray(model.fields, event.previousIndex, event.currentIndex);
		this.onModelChange();
	}
}
