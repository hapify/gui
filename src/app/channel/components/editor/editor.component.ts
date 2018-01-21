import {Component, ElementRef, Injector, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {ITemplate} from '../../interfaces/template';
import {GeneratorService} from '../../../generator/services/generator.service';
import {StorageService as ModelStorageService, IModel} from '../../../model/model.module';
import {IGeneratorResult} from '../../../generator/interfaces/generator-result';
import {HighlightJsService} from 'angular2-highlight-js';

@Component({
  selector: 'app-channel-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  /**
   * The generator service
   *
   * @type {GeneratorService}
   */
  generatorService: GeneratorService;

  /**
   * The generator service
   *
   * @type {ModelStorageService}
   */
  modelStorageService: ModelStorageService;

  /**
   * Template to edit instance
   *
   * @type {ITemplate}
   */
  @Input() template: ITemplate;

  /**
   * Max length allowed for the path
   *
   * @type {number}
   */
  @Input() pathMinLength: number = 1;

  /**
   * Min length allowed for the path
   *
   * @type {number}
   */
  @Input() pathMaxLength: number = 64;

  /**
   * @type {FormGroup}
   */
  form: FormGroup;
  /**
   * @type {{minLength: number; maxLength: number}}
   */
  translateParams = {
    minLength: this.pathMinLength,
    maxLength: this.pathMaxLength,
  };

  /**
   * @type {Subject<string>}
   * @private
   */
  private _onSave = new Subject<string>();
  /**
   * On save event (Observable)
   *
   * @type {Observable<string>}
   */
  @Output() onSave: Observable<string> = this._onSave.asObservable();

  /**
   * @type {Subject<void>}
   * @private
   */
  private _onCancel = new Subject<void>();
  /**
   * On save event (Observable)
   *
   * @type {Observable<void>}
   */
  @Output() onCancel: Observable<void> = this._onCancel.asObservable();

  /**
   * The edited template
   *
   * @type {ITemplate}
   */
  wip: ITemplate;

  /**
   * Demo models
   */
  models: IModel[];

  /**
   * Demo model
   */
  model: IModel;

  /**
   * Generation results
   */
  result: IGeneratorResult;

  /**
   * Generation error
   */
  error: string;

  /**
   * Denotes if should re-generate on change
   */
  autoGenerate: boolean = true;

  /**
   * Constructor
   */
  constructor(private formBuilder: FormBuilder,
              private injector: Injector,
              private elementRef: ElementRef,
              private highlightJsService: HighlightJsService,) {
    // Avoid circular dependency
    this.generatorService = this.injector.get(GeneratorService);
    this.modelStorageService = this.injector.get(ModelStorageService);
  }

  /**
   * On init
   */
  ngOnInit() {

    // Update translateParams
    this.translateParams.minLength = this.pathMinLength;
    this.translateParams.maxLength = this.pathMaxLength;

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

  /**
   * Called when the user click on save
   */
  didClickSave() {
    this.template.content = this.wip.content;
    this.template.path = this.wip.path;
    this._onSave.next();
  }

  /**
   * Called when the user click on cancel
   */
  didClickCancel() {
    this._onCancel.next();
  }

  /**
   * Runs the content generation
   *
   * @private
   */
  private _generate() {
    // Clean results and error
    this.result = null;
    this.error = null;
    // Run generation
    this.generatorService.run(this.wip, this.model)
      .then((result) => {
        this.result = result;
        setTimeout(() => {
          this.highlightJsService.highlight(this.elementRef.nativeElement.querySelector('.generated-code'));
        });
      })
      .catch((e) => {
        this.error = `${e.message}\n\n${e.stack}`;
      });
  }

  /**
   * Call when the content is left
   */
  onModelChange() {
    this._generate();
  }

  /**
   * Call when the content is left
   *
   * @param {string} content
   */
  onBlur(content: string) {
    this.wip.content = content;
    this._generate();
  }

  /**
   * Call when the content changes
   *
   * @param {string} content
   */
  onChange(content: string) {
    this.wip.content = content;
    if (this.autoGenerate) {
      this._generate();
    }
  }

  /**
   * Call when the user click on "dump"
   *
   * @param {string} content
   */
  async didClickDump(content: string) {
    console.log(await this.generatorService.inputs(this.model));
  }

}
