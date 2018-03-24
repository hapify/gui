import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
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
