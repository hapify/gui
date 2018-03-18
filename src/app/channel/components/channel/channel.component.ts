import {Component, OnInit, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {IChannel} from '../../interfaces/channel';
import {MasksDownloaderService} from '../../../loader/services/masks-downloader.service';

@Component({
  selector: 'app-channel-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

  /**
   * Constructor
   *
   * @param {FormBuilder} formBuilder
   * @param {MasksDownloaderService} masksDownloaderService
   */
  constructor(private formBuilder: FormBuilder,
              private masksDownloaderService: MasksDownloaderService) {
  }

  /**
   * Channel instance
   *
   * @type {IChannel}
   */
  @Input() channel: IChannel;
  /**
   * @type {Subject<void>}
   * @private
   */
  private _onSave = new Subject<void>();
  /**
   * On save event (Observable)
   *
   * @type {Observable<void>}
   */
  @Output() onSave: Observable<void> = this._onSave.asObservable();
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
    // Form validator
    this.form = this.formBuilder.group({
      name: new FormControl(this.channel.name, [
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
    this._onSave.next();
  }

  /**
   * Called when the user click on "add template"
   */
  addTemplate() {
    this.channel.addTemplate(this.channel.newTemplate());
  }

  /**
   * Called when the user click on "clean templates"
   */
  cleanTemplates() {
    this.channel.filter();
  }

  /**
   * Call zhen user click on download
   */
  onDownload() {
    this.masksDownloaderService.downloadAsZip(this.channel);
  }
}
