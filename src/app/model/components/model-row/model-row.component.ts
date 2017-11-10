import {Component, OnInit, Input, Output} from '@angular/core';
import {Observable, Subject} from 'rxjs';
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
   * @type {Subject<void>}
   * @private
   */
  _onDelete = new Subject<void>();
  /**
   * On delete event (Observable)
   *
   * @type {Observable<void>}
   */
  @Output() onDelete: Observable<void> = this._onDelete.asObservable();
  /**
   * @type {boolean}
   */
  deleteSwitch = false;

  /**
   * @inheritDoc
   */
  ngOnInit() {}

  /**
   * Called when the user click on "delete"
   */
  didClickDelete() {
    this._onDelete.next();
  }
}
