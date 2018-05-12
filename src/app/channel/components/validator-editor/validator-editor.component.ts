import {
  AfterViewInit, Component, EventEmitter, HostListener,
  Injector, Input, OnDestroy, OnInit, Output, ViewChild
} from '@angular/core';
import {GeneratorService} from '../../../generator/services/generator.service';
import {StorageService as ModelStorageService, IModel} from '../../../model/model.module';
import {AceService} from '../../../services/ace.service';
import {TranslateService} from '@ngx-translate/core';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {IChannel} from '../../interfaces/channel';
import {IValidatorResult} from '../../interfaces/validator-result';
import {ValidatorService} from '../../services/validator.service';

@Component({
  selector: 'app-channel-validator-editor',
  templateUrl: './validator-editor.component.html',
  styleUrls: ['./validator-editor.component.scss']
})
export class ValidatorEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  /** @type {GeneratorService} The generator service */
  generatorService: GeneratorService;
  /** @type {ModelStorageService} The generator service */
  modelStorageService: ModelStorageService;
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
  /** @type {IValidatorResult} Validation results */
  results: IValidatorResult = {
    errors: [],
    warnings: []
  };
  /** @type {Error} Validation error */
  error: Error;
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

  /**
   * Constructor
   *
   * @param {Injector} injector
   * @param {TranslateService} translateService
   * @param {HotkeysService} hotKeysService
   * @param {AceService} aceService
   * @param {ValidatorService} validatorService
   */
  constructor(private injector: Injector,
              private translateService: TranslateService,
              private hotKeysService: HotkeysService,
              public aceService: AceService,
              private validatorService: ValidatorService) {
    // Avoid circular dependency
    this.generatorService = this.injector.get(GeneratorService);
    this.modelStorageService = this.injector.get(ModelStorageService);
  }

  /**
   * On init
   */
  ngOnInit() {

    this.translateService.get('common_unload_warning')
      .subscribe((value) => this.beforeUnloadWarning = value);

    // Clone content
    this.content = this.channel.validator;

    // Save on Ctrl+S
    this.saveHotKeys = this.hotKeysService.add(new Hotkey('meta+s', (event: KeyboardEvent): boolean => {
      this.didClickSave();
      return false;
    }));

    // Get all models
    this.modelStorageService.list()
      .then((models) => {
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
    this.editorInput.getEditor().commands.addCommand(this._getEditorSaveCommand());
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
  private validate() {
    // Clean error
    this.error = null;
    // Run validation
    try {
      this.results = this.validatorService.run(this.content, this.model);
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
    console.log(await this.generatorService.inputs(this.model));
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
