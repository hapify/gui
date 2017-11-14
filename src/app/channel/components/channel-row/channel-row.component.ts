import {Component, OnInit, Input, Output} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {IChannel} from '../../interfaces/channel';

@Component({
  selector: 'app-channel-channel-row',
  templateUrl: './channel-row.component.html',
  styleUrls: ['./channel-row.component.scss']
})
export class ChannelRowComponent implements OnInit {

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   *Channel instance
   *
   * @type {IChannel}
   */
  @Input() channel: IChannel;
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
  ngOnInit() {
  }

  /**
   * Called when the user click on "delete"
   */
  didClickDelete() {
    this._onDelete.next();
  }
}
