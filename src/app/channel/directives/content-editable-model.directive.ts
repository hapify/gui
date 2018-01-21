import {Directive, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Directive({
  selector: '[contentEditableModel]',
  host: {
    '(blur)': 'onBlur()',
    '(keyup)': 'onChange()',
  }
})
export class ContentEditableModelDirective implements OnInit {
  @Input('contentEditableModel') model: string;
  @Input('contentChangeDelay') delay: number = 0;
  @Output('contentChange') change = new EventEmitter();
  @Output('contentBlur') blur = new EventEmitter();

  /**
   * Stores the last value
   */
  private _lastValue: string;

  /**
   * Stores the last change timeout
   */
  private _lastChangeTimeout: any;

  /**
   * Constructor
   *
   * @param {ElementRef} elRef
   */
  constructor(private elRef: ElementRef) {
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.elRef.nativeElement.innerText = this.model;
    this._lastValue = this.model;
  }

  /**
   * Called on keyup
   */
  onChange() {
    const value = this._getValue();
    if (value !== this._lastValue) {
      // Update value
      this._lastValue = value;
      // Restart change timer
      clearTimeout(this._lastChangeTimeout);
      this._lastChangeTimeout = setTimeout(() => {
        this.change.emit(value);
      }, this.delay * 1000);
    }
  }

  /**
   * Called on blur
   */
  onBlur() {
    const value = this._getValue();
    this._lastValue = value;
    this.blur.emit(value);
  }

  /**
   * Get the current value
   *
   * @return {string}
   * @private
   */
  private _getValue() {
    return this.elRef.nativeElement.innerText;
  }
  
}
