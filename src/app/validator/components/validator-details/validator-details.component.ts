import {Component, OnInit, Input, Injector} from '@angular/core';
import {ValidatorService} from '../../services/validator.service';
import {StorageService as ChannelStorageService} from '../../../channel/services/storage.service';
import {StorageService as ModelStorageService} from '../../../model/services/storage.service';
import {IModel} from '../../../model/interfaces/model';
import {IChannel} from '../../../channel/interfaces/channel';

@Component({
  selector: 'app-validator-details',
  templateUrl: './validator-details.component.html',
  styleUrls: ['./validator-details.component.scss']
})
export class ValidatorDetailsComponent implements OnInit {

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
  /** @type {string} Errors & warnings details */
  details: string = null;

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
    this.details = '';
    for (const channel of channels) {
      for (const model of models) {
        const {errors, warnings} = await this.validatorService.run(channel.validator, model);
        // Ignore details
        if (errors.length === 0 && warnings.length === 0) {
          continue;
        }
        // Title
        this.details += `${channel.name} x ${model.name}:\n`;
        if (errors.length > 0) {
          this.details += `  ${errors.length} error${errors.length > 1 ? 's' : ''}\n`;
          this.details += `    ${errors.join('\n')}${errors.length ? '\n' : ''}\n`;
        }
        if (warnings.length > 0) {
          this.details += `  ${warnings.length} warning${warnings.length > 1 ? 's' : ''}\n`;
          this.details += `    ${warnings.join('\n')}${warnings.length ? '\n' : ''}\n`;
        }
      }
    }

    // Null if empty
    if (this.details.length === 0) {
      this.details = null;
    }
    
  }

}
