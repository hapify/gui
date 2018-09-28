import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {IChannel} from '../../interfaces/channel';
import {SyncService} from '../../services/sync.service';

@Component({
  selector: 'app-channel-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

  /** @type {IChannel} Channel instance */
  @Input() channel: IChannel;
  /** @type {EventEmitter<void>} On save event */
  @Output() onSave = new EventEmitter<void>();
  /** @type {FormGroup} */
  form: FormGroup;
  /** @type {number} */
  minLength = 2;
  /** @type {number} */
  maxLength = 32;
  /** @type {boolean} */
  syncing = false;
  /** @type {{minLength: number; maxLength: number}} */
  translateParams = {
    minLength: this.minLength,
    maxLength: this.maxLength,
  };
  /** @type {boolean} */
  showValidatorEditor = false;

  /**
   * Constructor
   *
   * @param {FormBuilder} formBuilder
   * @param {SyncService} syncService
   */
  constructor(private formBuilder: FormBuilder,
              public syncService: SyncService) {
  }

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
   * Called when the user click on "Open Validator Editor" button
   */
  onShowValidatorEditor() {
    this.showValidatorEditor = true;
  }

  /**
   * Called when the ValidatorEditor is saved
   */
  onValidatorEditorSave() {
    this.onSave.emit();
  }

  /**
   * Called when the ValidatorEditor is saved
   */
  onValidatorEditorClose() {
    this.showValidatorEditor = false;
  }
}
