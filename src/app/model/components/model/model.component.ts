import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';
import {IModel} from '../../interfaces/model';
import {Access} from '../../interfaces/access';
import {ILabelledValue} from '../../interfaces/labelled-value';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {Field} from '../../classes/field';

@Component({
  selector: 'app-model-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit, OnDestroy {

  /**
   * Constructor
   */
  constructor(private formBuilder: FormBuilder,
              private hotKeysService: HotkeysService) {
  }

  /** @type {IModel} Model instance */
  @Input() model: IModel;
  /** @type {EventEmitter<void>} On save event */
  @Output() onSave = new EventEmitter<void>();
  /** @type {EventEmitter<void>} Notify changes */
  @Output() onChange = new EventEmitter<void>();
  /** @type {FormGroup} */
  form: FormGroup;
  /** @type {number} */
  minLength = 2;
  /** @type {number} */
  maxLength = 32;
  /** @type {{minLength: number; maxLength: number}} */
  translateParams = {
    minLength: this.minLength,
    maxLength: this.maxLength,
  };
  /** @type {number} The debounce delay before triggering the event */
  private debounceTimeDelay = 300;
  /** @type {Subject<void>} Subject for debounced keyup event */
  private keyupSubject = new Subject<void>();
  /** @type {Subscription[]} Subscription of the component */
  private subscriptions: Subscription[] = [];
  /** @type {boolean} Denotes if the user has unsaved changes (to prevent reload) */
  unsavedChanges = false;
  /** @type{Hotkey|Hotkey[]} Hotkeys to unbind */
  private saveHotKeys: Hotkey|Hotkey[];
  /** @type {ILabelledValue[]} Available accesses */
  accesses: ILabelledValue[] = [
    {name: 'Admin', value: Access.ADMIN},
    {name: 'Owner', value: Access.OWNER},
    {name: 'Authenticated', value: Access.AUTHENTICATED},
    {name: 'Guest', value: Access.GUEST},
  ];
  
  /**
   * @inheritDoc
   */
  ngOnInit() {
    // Subscriptions
    this.subscriptions = [
      this.keyupSubject
        .pipe(debounceTime<void>(this.debounceTimeDelay))
        .subscribe(() => {
          this.onModelChange();
        })
    ];
    // Form validator
    this.form = this.formBuilder.group({
      name: new FormControl(this.model.name, [
        Validators.required,
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength),
      ]),
    });
    // Save on Ctrl+S
    this.saveHotKeys = this.hotKeysService.add(new Hotkey('meta+s', (event: KeyboardEvent): boolean => {
      this.onSubmit();
      return false;
    }));
  }

  /**
   * Destroy
   */
  ngOnDestroy() {
    this.hotKeysService.remove(this.saveHotKeys);
    this.subscriptions.map((s) => s.unsubscribe());
  }

  /**
   * Called when the user click on "save"
   */
  onSubmit() {
    this.onSave.emit();
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
    this.onChange.emit();
    this.unsavedChanges = true;
  }

  /**
   * Called when a value change and should be debounced
   */
  onDebouncedChange(): void {
    this.keyupSubject.next();
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
    return this.accessPosition(this.model.accesses[action]) >= this.accessPosition(access.value);
  }

  /**
   * Get the position in importance
   * @param name
   * @return {number}
   */
  accessPosition(name): number {
    if (name === Access.ADMIN) { return 0; }
    if (name === Access.OWNER) { return 1; }
    if (name === Access.AUTHENTICATED) { return 2; }
    if (name === Access.GUEST) { return 3; }
    return -1;
  }
}
