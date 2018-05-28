import {Component, OnInit, Input, Injector} from '@angular/core';
import {ValidatorService} from '../../services/validator.service';
import {StorageService as ChannelStorageService} from '../../../channel/services/storage.service';
import {StorageService as ModelStorageService} from '../../../model/services/storage.service';
import {IModel} from '../../../model/interfaces/model';
import {IChannel} from '../../../channel/interfaces/channel';

@Component({
  selector: 'app-validator-icon',
  templateUrl: './validator-icon.component.html',
  styleUrls: ['./validator-icon.component.scss']
})
export class ValidatorIconComponent implements OnInit {

  /** @type {ChannelStorageService} The channel storage service */
  private channelStorageService: ChannelStorageService;
  /** @type {ModelStorageService} The model storage service */
  private modelStorageService: ModelStorageService;
  /** @type {ValidatorService} The validator service */
  private validatorService: ValidatorService;
  /** @type {IModel} */
  private modelValue: IModel;
  /** @type {IModel[]} */
  private models: IModel[] = [];
  /** @type {IChannel} */
  private channelValue: IChannel;
  /** @type {IChannel[]} */
  private channels: IChannel[] = [];
  /** @type {boolean} Denotes if the process can be ran */
  private initialized = false;
  /** @type {string} Pre-computed error level */
  level = 'undefined';

  /** Model getter */
  @Input()
  get model() {
    return this.modelValue;
  }

  /** @param val Model setter */
  set model(val) {
    this.modelValue = val;
    this.run();
  }

  /** Channel getter */
  @Input()
  get channel() {
    return this.channelValue;
  }

  /** @param val Channel setter */
  set channel(val) {
    this.channelValue = val;
    this.run();
  }

  /**
   * Constructor
   *
   * @param {Injector} injector
   */
  constructor(private injector: Injector) {
  }

  /**
   * On init
   */
  ngOnInit() {
    // Avoid circular dependency
    this.channelStorageService = this.injector.get(ChannelStorageService);
    this.modelStorageService = this.injector.get(ModelStorageService);
    this.validatorService = this.injector.get(ValidatorService);

    // Load channels and models once
    Promise.all([
      this.channelStorageService.list().then((channels) => {
        this.channels = channels;
      }),
      this.modelStorageService.list().then((models) => {
        this.models = models;
      })
    ])
      .then(() => {
        this.initialized = true;
        this.run();
      });
  }

  /**
   * Run the process for Models x Channels
   */
  private async run() {
    // Check if possible
    if (!this.initialized) {
      return;
    }

    // Start process
    const channels = typeof this.channelValue === 'undefined' ?
      this.channels : [this.channelValue];
    const models = typeof this.modelValue === 'undefined' ?
      this.models : [this.modelValue];

    // Stop process on first error
    let hasError = false;
    let hasWarning = false;
    for (const channel of channels) {
      if (hasError) {
        break;
      }
      for (const model of models) {
        if (hasError) {
          break;
        }
        const result = await this.validatorService.run(channel.validator, model);
        hasError = hasError || result.errors.length > 0;
        hasWarning = hasWarning || result.warnings.length > 0;
      }
    }

    if (hasError) {
      this.level = 'error';
    } else if (hasWarning) {
      this.level = 'warning';
    } else {
      this.level = 'valid';
    }
  }

}
