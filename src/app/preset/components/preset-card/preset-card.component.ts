import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {IPreset} from '../../interfaces/preset';

@Component({
  selector: 'app-preset-preset-card',
  templateUrl: './preset-card.component.html',
  styleUrls: ['./preset-card.component.scss']
})
export class PresetCardComponent implements OnInit {

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Preset instance
   *
   * @type {IPreset}
   */
  @Input() preset: IPreset;
  /**
   * On apply event
   *
   * @type {EventEmitter<void>}
   */
  @Output() onApply = new EventEmitter<void>();

  /**
   * @inheritDoc
   */
  ngOnInit() {
  }

  /**
   * Called when the user click on "apply"
   */
  didClickApply() {
    this.onApply.emit();
  }
}
