import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {IChannel} from '../../interfaces/channel';
import {MasksDownloaderService} from '../../../loader/services/masks-downloader.service';
import {SyncService} from '../../services/sync.service';

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
   * @param {SyncService} syncService
   */
  constructor(private formBuilder: FormBuilder,
              private masksDownloaderService: MasksDownloaderService,
              public syncService: SyncService) {
  }

  /**
   * Channel instance
   *
   * @type {IChannel}
   */
  @Input() channel: IChannel;
  /**
   * On save event
   *
   * @type {EventEmitter<void>}
   */
  @Output() onSave = new EventEmitter<void>();
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
   * @type {boolean}
   */
  syncing = false;
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
    this.onSave.emit();
  }

  /**
   * Will sync all templates of the channel
   */
  async onSync() {
    this.syncing = true;
    for (let i = 0; i < this.channel.templates.length; i++) {
      await this.syncService.run(this.channel.templates[i])
        .catch(console.error);
    }
    this.syncing = false;
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
