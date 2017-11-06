import { Component, OnInit, Input, Output } from '@angular/core';
import {Field} from '../../interfaces/field';

@Component({
  selector: 'app-model-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  constructor() {}

  /**
   * Input field
   */
  @Input() field: Field;

  ngOnInit() {
  }

}
