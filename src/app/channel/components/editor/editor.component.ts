import {
  AfterViewInit,
  Component, EventEmitter, HostListener, Injector, Input, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {ITemplate} from '../../interfaces/template';
import {GeneratorService} from '../../services/generator.service';
import {StorageService as ModelStorageService, IModel} from '../../../model/model.module';
import {IGeneratorResult} from '../../interfaces/generator-result';
import {AceService} from '../../../services/ace.service';
import {TranslateService} from '@ngx-translate/core';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';

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
  /** @type {number} Max length allowed for the path */
  @Input() pathMinLength = 1;
  /** @type {number} Min length allowed for the path */
  @Input() pathMaxLength = 64;
  /** @type {FormGroup} */
  form: FormGroup;
  /** @type {{minLength: number; maxLength: number}} */
  translateParams = {
    minLength: this.pathMinLength,
    maxLength: this.pathMaxLength,
  };
  /** @type {EventEmitter<ITemplate|null>} On save event */
  @Output() onSave = new EventEmitter<ITemplate|null>();
  /** @type {EventEmitter<void>} On save event */
  @Output() onClose = new EventEmitter<void>();
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
  /** Denotes if should re-generate on change */
  autoGenerate = true;
  /** Text display to prevent reloading */
  private beforeUnloadWarning: string;
  /** @type {boolean} Denotes if the user has unsaved changes (to prevent reload) */
  unsavedChanges = false;
  /** Hotkeys to unbind */
  private saveHotKeys: Hotkey | Hotkey[];
  /** Left editor */
  @ViewChild('editorInput') editorInput;
  /**
   * Constructor
   * @param {FormBuilder} formBuilder
   * @param {Injector} injector
   * @param {TranslateService} translateService
   * @param {HotkeysService} hotKeysService
   * @param {AceService} aceService
   */
  constructor(private formBuilder: FormBuilder,
              private injector: Injector,
              private translateService: TranslateService,
              private hotKeysService: HotkeysService,
              public aceService: AceService) {
    // Avoid circular dependency
    this.generatorService = this.injector.get(GeneratorService);
    this.modelStorageService = this.injector.get(ModelStorageService);
  }
  /** On init */
  ngOnInit() {

    // Update translateParams
    this.translateParams.minLength = this.pathMinLength;
    this.translateParams.maxLength = this.pathMaxLength;

    this.translateService.get('common_unload_warning')
      .subscribe((value) => this.beforeUnloadWarning = value);

    // Save on Ctrl+S
    this.saveHotKeys = this.hotKeysService.add(new Hotkey('meta+s', (event: KeyboardEvent): boolean => {
      this.didClickSave();
      return false;
    }));

    // Clone input template
    this.wip = this.template.clone();

    // Get all models
    this.modelStorageService.list()
      .then((models) => {
        this.models = models;
        if (this.wip.needsModel()) {
          this.model = this.models[0];
        }
        // Generate
        this._generate();
      });

    // Form validator
    this.form = this.formBuilder.group({
      path: new FormControl(this.wip.path, [
        Validators.minLength(this.pathMinLength),
        Validators.maxLength(this.pathMaxLength),
      ])
    });
  }
  /** Destroy */
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
    this.onSave.emit(this.generatorService.autoSyncEnabled ? this.wip : null);
  }
  /** Called when the user click on close */
  didClickClose() {
    this.onClose.emit();
  }
  /**
   * Runs the content generation
   * @private
   */
  private _generate() {
    // Clean results and error
    // Run generation
    this.generatorService.run(this.wip, this.model)
      .then((result) => {
        this.result = result;
        this.error = null;
        this.pathResult = result.path;
      })
      .catch((e) => {
        this.result = null;
        this.error = `${e.message}\n\n${e.stack}`;
      });
  }
  /**
   * Runs the path generation
   * @private
   */
  private _generatePath() {
    // Run generation
    this.generatorService.path(this.wip, this.model)
      .then((result) => {
        this.pathResult = result;
      })
      .catch((e) => {
        this.error = `${e.message}\n\n${e.stack}`;
      });
  }
  /** Call when the selected model is changed */
  onModelChange() {
    this._generate();
  }
  /** Call when the path is changed */
  onPathChange() {
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
    if (this.autoGenerate) {
      this._generate();
    }
  }
  /** Call when the user click on "dump" */
  async didClickDump() {
    // @todo Dump in bash
    console.log('To be implemented');
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
