import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {IChannel} from '../../interfaces/channel';

@Component({
  selector: 'app-channel-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  /**
   * Constructor
   */
  constructor(private storageService: StorageService) {
  }

  /**
   * Channel instances
   *
   * @type {IChannel[]}
   */
  public channels: IChannel[];

  /**
   * @inheritDoc
   */
  ngOnInit() {
    this.updateChannels();
  }

  /**
   * Called when the user update the channel
   */
  deleteChannel(channel: IChannel): void {
    // Store the channel
    this.storageService.remove(channel)
      .then(() => this.updateChannels());
  }

  /**
   * Update channels with storage
   *
   * @returns {Promise<void>}
   */
  protected updateChannels(): Promise<void> {
    return this.storageService.list()
      .then((channels) => {
        channels.sort((a, b) => a.name.localeCompare(b.name));
        this.channels = channels;
      });
  }

}
