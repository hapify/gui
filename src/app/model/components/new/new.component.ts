import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Model} from '../../classes/model';

@Component({
  selector: 'app-model-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  /**
   * Constructor
   */
  constructor(private formBuilder: FormBuilder,
              private translateService: TranslateService) {}

  /**
   * New model instance
   *
   * @type {Model}
   */
  public model: Model;
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
    // New model
    this.model = new Model();
    this.translateService.get('new_model_name').subscribe((text) => {
      this.model.name = text;
    });
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

  }

}
