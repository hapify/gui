import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-deployer-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  /**
   * @type {string}
   */
  branch = 'develop';

  /**
   * @type {[string]}
   */
  branches = [
    'master',
    'develop'
  ];

  /**
   * @type {string}
   */
  name = '';

  /**
   *
   * @type {boolean}
   */
  pending = false;
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
  maxLength = 32;
  /**
   * @type {{minLength: number; maxLength: number}}
   */
  translateParams = {
    minLength: this.minLength,
    maxLength: this.maxLength,
  };
  
  /**
   * Constructor
   *
   * @param {FormBuilder} formBuilder
   */
  constructor(private formBuilder: FormBuilder) {
  }

  /**
   * On Init
   */
  ngOnInit() {
    // Form validator
    this.form = this.formBuilder.group({
      name: new FormControl(this.name, [
        Validators.required,
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength),
      ]),
      branch: new FormControl(this.branch, [
        Validators.required,
      ]),
    });
  }

  /**
   * Called when the user click on "save"
   */
  onSubmit() {
  }


}
