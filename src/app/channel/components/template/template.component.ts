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
  maxLength = 128;
  /**
   * @type {boolean}
   */
  showCode = true;
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
    {name: 'Basic', value: TemplateType.Basic}
  ];

  /**
   * @inheritDoc
   */
  ngOnInit() {
    // Form validator
    this.form = this.formBuilder.group({
      path: new FormControl(this.template.path, [
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength),
      ]),
      type: new FormControl(this.template.type, []),
      content: new FormControl(this.template.content, []),
    });
  }
}
