import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {IField} from '../../interfaces/field';
import {FieldType} from '../../interfaces/field-type.enum';

@Component({
  selector: 'app-model-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  /**
   * Constructor
   */
  constructor(private formBuilder: FormBuilder) {
  }

  /**
   * New field instance
   *
   * @type {IField}
   */
  @Input() field: IField;
  /**
   * @type {FormGroup}
   */
  form: FormGroup;
  /**
   * @type {number}
   */
  minLength = 1;
  /**
   * @type {number}
   */
  maxLength = 64;
  /**
   * @type {{minLength: number; maxLength: number}}
   */
  translateParams = {
    minLength: this.minLength,
    maxLength: this.maxLength,
  };
  /**
   * Availables types
   */
  types: [{
    value: FieldType;
    name: string;
  }] = [
    {name: 'String', value: FieldType.String},
    {name: 'Number', value: FieldType.Number},
    {name: 'Boolean', value: FieldType.Boolean},
    {name: 'Entity', value: FieldType.Entity}
  ];

  /**
   * @inheritDoc
   */
  ngOnInit() {
    // Form validator
    this.form = this.formBuilder.group({
      name: new FormControl(this.field.name, [
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength),
      ]),
      type: new FormControl(this.field.type, [
        Validators.required
      ]),
      primary: new FormControl(this.field.primary, [
        Validators.required
      ]),
      searchable: new FormControl(this.field.searchable, [
        Validators.required
      ]),
      sortable: new FormControl(this.field.sortable, [
        Validators.required
      ]),
      isPrivate: new FormControl(this.field.isPrivate, [
        Validators.required
      ]),
      internal: new FormControl(this.field.internal, [
        Validators.required
      ]),
    });
  }
}
