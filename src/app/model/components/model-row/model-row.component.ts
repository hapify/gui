import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {IModel} from '../../interfaces/model';

@Component({
  selector: 'app-model-model-row',
  templateUrl: './model-row.component.html',
  styleUrls: ['./model-row.component.scss']
})
export class ModelRowComponent implements OnInit {

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   *Model instance
   *
   * @type {IModel}
   */
  @Input() model: IModel;
  /**
   * On delete event
   *
   * @type {EventEmitter<void>}
   */
  @Output() onDelete = new EventEmitter<void>();
  /**
   * @type {boolean}
   */
  deleteSwitch = false;

  /**
   * @inheritDoc
   */
  ngOnInit() {
  }

  /**
   * Called when the user click on "delete"
   */
  didClickDelete() {
    this.onDelete.emit();
  }
}
