import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {ITemplate} from '../../interfaces/template';
import {TemplateType} from '../../interfaces/template-type.enum';

@Component({
  selector: 'app-channel-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  /**
   * Constructor
   */
  constructor(private formBuilder: FormBuilder) {
  }

  /**
   * New template instance
   *
   * @type {ITemplate}
   */
  @Input() template: ITemplate;
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
    value: TemplateType;
    name: string;
  }] = [
    {name: 'String', value: TemplateType.String},
    {name: 'Number', value: TemplateType.Number},
    {name: 'Boolean', value: TemplateType.Boolean},
    {name: 'Array', value: TemplateType.Array},
    {name: 'Object', value: TemplateType.Object},
  ];

  /**
   * @inheritDoc
   */
  ngOnInit() {
    // Form validator
    this.form = this.formBuilder.group({
      name: new FormControl(this.template.name, [
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength),
      ]),
      type: new FormControl(this.template.type, [
        Validators.required
      ]),
      primary: new FormControl(this.template.primary, [
        Validators.required
      ]),
      searchable: new FormControl(this.template.searchable, [
        Validators.required
      ]),
      sortable: new FormControl(this.template.sortable, [
        Validators.required
      ]),
    });
  }
}
