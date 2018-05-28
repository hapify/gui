import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';
import {IModel} from '../../interfaces/model';

@Component({
  selector: 'app-model-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit, OnDestroy {

  /**
   * Constructor
   */
  constructor(private formBuilder: FormBuilder) {
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
  }

  /**
   * Destroy
   */
  ngOnDestroy() {
    this.subscriptions.map((s) => s.unsubscribe());
  }

  /**
   * Called when the user click on "save"
   */
  onSubmit() {
    this.onSave.emit();
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
  cleanFields() {
    this.model.filter();
    this.onModelChange();
  }

  /**
   * Called when a field change
   */
  onModelChange() {
    this.onChange.emit();
  }

  /**
   * Called when a value change and should be debounced
   */
  onDebouncedChange(): void {
    this.keyupSubject.next();
  }
}
