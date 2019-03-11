import {
	AfterViewInit,
	ChangeDetectorRef,
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
import { ITemplate } from '../../interfaces/template';
import { GeneratorService } from '../../services/generator.service';
import {
	StorageService as ModelStorageService,
	IModel
} from '../../../model/model.module';
import { IGeneratorResult } from '../../interfaces/generator-result';
import { AceService } from '@app/services/ace.service';
import { TranslateService } from '@ngx-translate/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { MessageService } from '@app/services/message.service';
import { RichError } from '@app/class/RichError';

@Component({
	selector: 'app-channel-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy, AfterViewInit {
	/** @type {GeneratorService} The generator service */
	generatorService: GeneratorService;
	/** @type {ModelStorageService} The generator service */
	modelStorageService: ModelStorageService;
	/** @type {ITemplate} Template to edit instance */
	@Input() template: ITemplate;
	/** @type {EventEmitter<ITemplate|null>} On save event */
	@Output() save = new EventEmitter<ITemplate | null>();
	/** @type {EventEmitter<void>} On save event */
	@Output() close = new EventEmitter<void>();
	/** @type {ITemplate} The edited template */
	wip: ITemplate;
	/** Preview models */
	models: IModel[];
	/** Preview model */
	model: IModel;
	/** Generation results */
	result: IGeneratorResult;
	/** Generation results for path only */
	pathResult: string;
	/** Generation error */
	error: string;
	/** Denotes if should re-generate preview on change */
	autoRefresh = true;
	/** Text display to prevent reloading */
	private beforeUnloadWarning: string;
	/** @type {boolean} Denotes if the user has unsaved changes (to prevent reload) */
	unsavedChanges = false;
	/** Hotkeys to unbind */
	private saveHotKeys: Hotkey | Hotkey[];
	/** Error codes to display in editor */
	private handledCodes = [1003, 1004, 1005, 2004, 2005];
	/** Left editor */
	@ViewChild('editorInput') editorInput;
	/** Constructor */
	constructor(
		private injector: Injector,
		private translateService: TranslateService,
		private hotKeysService: HotkeysService,
		public aceService: AceService,
		private messageService: MessageService,
		private cd: ChangeDetectorRef
	) {
		// Avoid circular dependency
		this.generatorService = this.injector.get(GeneratorService);
		this.modelStorageService = this.injector.get(ModelStorageService);
	}
	/** On init */
	ngOnInit() {
		// Handle generation messages
		this.messageService.addErrorHandler({
			name: 'template-editor',
			handle: (error: Error) => this._handledError(error)
		});

		// Unloading message
		this.translateService
			.get('common_unload_warning')
			.subscribe(value => (this.beforeUnloadWarning = value));

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

		// Clone input template
		this.wip = this.template.clone();

		// Get all models
		this.modelStorageService.list().then(models => {
			this.models = models;
			if (this.wip.needsModel()) {
				this.model = this.models[0];
			}
			// Generate
			this._generate();
		});
	}

	/** Destroy */
	ngOnDestroy() {
		this.hotKeysService.remove(this.saveHotKeys);
		this.messageService.removeErrorHandler('template-editor');
	}
	/**
	 * After init
	 * Bind Ctrl-S inside the editors
	 */
	ngAfterViewInit() {
		this.editorInput
			.getEditor()
			.commands.addCommand(this._getEditorSaveCommand());
		this.cd.detectChanges();
	}
	/** Get the save command for the editors */
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
	/** Called when the user click on save */
	didClickSave() {
		this.template.content = this.wip.content;
		this.template.path = this.wip.path;
		this.unsavedChanges = false;
		this.save.emit(this.generatorService.autoSyncEnabled ? this.wip : null);
	}
	/** Called when the user click on close */
	didClickClose() {
		this.close.emit();
	}
	/**
	 * Runs the content generation
	 * @private
	 */
	private _generate() {
		// Clean results and error
		// Run generation
		this.generatorService
			.run(this.wip, this.model)
			.then(result => {
				this.result = result;
				this.error = null;
				this.pathResult = result.path;
			})
			.catch(e => {
				this.result = null;
				this._formatError(e);
			});
	}
	/**
	 * Runs the path generation
	 * @private
	 */
	private _generatePath() {
		// Run generation
		this.generatorService
			.path(this.wip, this.model)
			.then(result => {
				this.pathResult = result;
			})
			.catch(e => {
				this._formatError(e);
			});
	}
	/** Format an error to be displayed */
	private _formatError(error: Error) {
		if (this._handledError(error)) {
			this.error = (<RichError>error).details();
		}
	}
	/** Format an error to be displayed */
	private _handledError(error: Error): boolean {
		return (
			error instanceof RichError &&
			this.handledCodes.includes(error.data.code)
		);
	}

	/** Call when the selected model is changed */
	onModelChange() {
		this._generate();
	}
	/** Call when the path is changed */
	onPathChange(value: string) {
		this.wip.path = value;
		this._generatePath();
	}
	/**
	 * Call when the content is left
	 * @param {string} content
	 */
	onBlur(content: string) {
		this.wip.content = content;
		this._generate();
	}
	/**
	 * Call when the content changes
	 * @param {string} content
	 */
	onChange(content: string) {
		this.wip.content = content;
		this.unsavedChanges = true;
		if (this.autoRefresh) {
			this._generate();
		}
	}
	/** Call when the user click on "dump" */
	async didClickDump() {
		// @todo Dump in popin
		this.messageService.info('To be implemented');
	}
	/**
	 * Prevent reloading
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
