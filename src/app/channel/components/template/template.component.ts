import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {ITemplate} from '../../interfaces/template';
import {TemplateEngine} from '../../interfaces/template-engine.enum';
import {TemplateInput} from '../../interfaces/template-input.enum';

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
   * Available engines
   */
  engines: [{
    value: string;
    name: string;
  }] = [
    {name: 'doT', value: TemplateEngine.doT},
    {name: 'Mustache', value: TemplateEngine.Mustache}
  ];
  /**
   * Available inputs
   */
  inputs: [{
    value: string;
    name: string;
  }] = [
    {name: 'template_input_one', value: TemplateInput.One},
    {name: 'template_input_all', value: TemplateInput.All}
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
      path: new FormControl(this.template.path, [
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength),
      ]),
      engine: new FormControl(this.template.engine, [
        Validators.required
      ]),
      input: new FormControl(this.template.input, [
        Validators.required
      ]),
      content: new FormControl(this.template.content, []),
    });
  }
}
