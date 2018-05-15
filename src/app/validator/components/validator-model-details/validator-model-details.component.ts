import {Component, OnInit, Input} from '@angular/core';
import {StorageService as ChannelStorageService} from '../../../channel/services/storage.service';
import {ValidatorService} from '../../services/validator.service';
import {IModel} from '../../../model/interfaces/model';
import {IChannel} from '../../../channel/interfaces/channel';

@Component({
  selector: 'app-validator-model-details',
  templateUrl: './validator-model-details.component.html',
  styleUrls: ['./validator-model-details.component.scss']
})
export class ValidatorModelDetailsComponent implements OnInit {

  /** @type {IModel} */
  @Input() model: IModel;
  /** @type {IChannel[]} */
  private channels: IChannel[];

  /**
   * Constructor
   *
   * @param {ValidatorService} validatorService
   * @param {StorageService} channelStorageService
   */
  constructor(private validatorService: ValidatorService,
              private channelStorageService: ChannelStorageService) {
  }

  /**
   * On init
   */
  ngOnInit() {
    // Load channels once
    this.channelStorageService.list()
      .then((channels) => {
        this.channels = channels;
      });
  }

}
