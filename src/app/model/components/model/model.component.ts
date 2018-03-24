import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {IModel} from '../../interfaces/model';

@Component({
  selector: 'app-model-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit {

  /**
   * Constructor
   */
  constructor(private formBuilder: FormBuilder) {
  }

  /**
   * Model instance
   *
   * @type {IModel}
   */
  @Input() model: IModel;
  /**
   * On save event
   *
   * @type {EventEmitter<void>}
   */
  @Output() onSave = new EventEmitter<void>();
  /**
   * @type {FormGroup}
   */
  form: FormGroup;
  /**
   * @type {number}
   */
  minLength = 2;
  /**
   * @type {number}
   */
  maxLength = 32;
  /**
   * @type {{minLength: number; maxLength: number}}
   */
  translateParams = {
    minLength: this.minLength,
    maxLength: this.maxLength,
  };

  /**
   * @inheritDoc
   */
  ngOnInit() {
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
  }

  /**
   * Called when the user click on "clean fields"
   */
  cleanFields() {
    this.model.filter();
  }
}
