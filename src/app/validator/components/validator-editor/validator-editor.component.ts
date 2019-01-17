import {
	AfterViewInit,
	Component,
	EventEmitter,
	HostListener,
	Injector,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import {
	StorageService as ModelStorageService,
	IModel
} from '@app/model/model.module';
import { AceService } from '@app/services/ace.service';
import { TranslateService } from '@ngx-translate/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { IValidatorResult } from '../../interfaces/validator-result';
import { ValidatorService } from '../../services/validator.service';
import { IChannel } from '@app/channel/interfaces/channel';
import { MessageService } from '@app/services/message.service';

@Component({
	selector: 'app-validator-editor',
	templateUrl: './validator-editor.component.html',
	styleUrls: ['./validator-editor.component.scss']
})
export class ValidatorEditorComponent
	implements OnInit, OnDestroy, AfterViewInit {
	/** @type {ModelStorageService} The model storage service */
	modelStorageService: ModelStorageService;
	/** @type {ValidatorService} The validator service */
	validatorService: ValidatorService;
	/** @type {IChannel} The calling channel */
	@Input() channel: IChannel;
	/** @type {EventEmitter<void>} On save event */
	@Output() onSave = new EventEmitter<void>();
	/** @type {EventEmitter<void>} On save event */
	@Output() onClose = new EventEmitter<void>();
	/** @type {string} The edited template */
	content: string;
	/** @type {string} The content mode for ACE */
	aceMode = 'js';
	/** @type {IModel[]} Models for auto-check */
	models: IModel[];
	/** @type {IModel} Checked model */
	model: IModel;
	/** @type {IValidatorResult} Validation result */
	result: IValidatorResult;
	/** @type {Error} Validation error */
	error: Error;
	/** @type {string} Result summary */
	summary = '';
	/** @type {boolean} Denotes if should auto-check on change */
	autoValidate = true;
	/** @type {string} Text display to prevent reloading */
	private beforeUnloadWarning: string;
	/** @type {boolean} Denotes if the user has unsaved changes (to prevent reload) */
	unsavedChanges = false;
	/** @type {Hotkey|Hotkey[]} Hotkeys to unbind */
	private saveHotKeys: Hotkey | Hotkey[];
	/** Main editor */
	@ViewChild('editorInput') editorInput;

	/** Constructor */
	constructor(
		private injector: Injector,
		private translateService: TranslateService,
		private hotKeysService: HotkeysService,
		public aceService: AceService,
		private messageService: MessageService
	) {}

	/**
	 * On init
	 */
	ngOnInit() {
		// Avoid circular dependency
		this.modelStorageService = this.injector.get(ModelStorageService);
		this.validatorService = this.injector.get(ValidatorService);

		this.translateService
			.get('common_unload_warning')
			.subscribe(value => (this.beforeUnloadWarning = value));

		// Clone content
		this.content = this.channel.validator;

		// Save on Ctrl+S
		this.saveHotKeys = this.hotKeysService.add(
			new Hotkey(
				'meta+s',
				(event: KeyboardEvent): boolean => {
					this.didClickSave();
					return false;
				}
			)
		);

		// Get all models
		this.modelStorageService.list().then(models => {
			this.models = models;
			this.model = this.models[0];
			// Re validate
			this.validate();
		});
	}

	/**
	 * Destroy
	 */
	ngOnDestroy() {
		this.hotKeysService.remove(this.saveHotKeys);
	}

	/**
	 * After init
	 * Bind Ctrl-S inside the editors
	 */
	ngAfterViewInit() {
		this.editorInput
			.getEditor()
			.commands.addCommand(this._getEditorSaveCommand());
	}

	/**
	 * Get the save command for the editors
	 */
	private _getEditorSaveCommand(): any {
		return {
			name: 'saveCommand',
			bindKey: {
				win: 'Ctrl-S',
				mac: 'Command-S',
				sender: 'editor|cli'
			},
			exec: () => {
				this.didClickSave();
			}
		};
	}

	/**
	 * Called when the user click on save
	 */
	didClickSave() {
		this.channel.validator = this.content;
		this.unsavedChanges = false;
		this.onSave.emit();
	}

	/**
	 * Called when the user click on close
	 */
	didClickClose() {
		this.onClose.emit();
	}

	/**
	 * Runs the content generation
	 *
	 * @private
	 */
	private async validate() {
		// Clean error
		this.error = null;
		// Run validation
		try {
			this.result = await this.validatorService.run(
				this.content,
				this.model
			);

			const { errors, warnings } = this.result;

			this.summary = `${errors.length} error${
				errors.length > 1 ? 's' : ''
			}`;
			this.summary = `${this.summary}\n${errors.join('\n')}${
				errors.length ? '\n' : ''
			}`;
			this.summary = `${this.summary}\n${warnings.length} warning${
				warnings.length > 1 ? 's' : ''
			}`;
			this.summary = `${this.summary}\n${warnings.join('\n')}`;
		} catch (error) {
			this.error = error;
		}
	}

	/**
	 * Call when the selected model is changed
	 */
	onModelChange() {
		this.validate();
	}

	/**
	 * Call when the content is left
	 *
	 * @param {string} content
	 */
	onBlur(content: string) {
		this.content = content;
		this.validate();
	}

	/**
	 * Call when the content changes
	 *
	 * @param {string} content
	 */
	onChange(content: string) {
		this.content = content;
		this.unsavedChanges = true;
		if (this.autoValidate) {
			this.validate();
		}
	}

	/**
	 * Call when the user click on "dump"
	 */
	async didClickDump() {
		this.messageService.log(this.model.toObject());
	}

	/**
	 * Prevent reloading
	 *
	 * @param event
	 * @return {string|null}
	 */
	@HostListener('window:beforeunload', ['$event'])
	beforeUnloadHandler(event: any): string {
		if (!this.unsavedChanges) {
			return;
		}
		event.returnValue = this.beforeUnloadWarning;
		return this.beforeUnloadWarning;
	}
}
