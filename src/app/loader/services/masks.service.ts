import {Injectable} from '@angular/core';
import {StorageService as ChannelStorageService, Channel, ITemplateBase} from '../../channel/channel.module';
import {IChannelManifest, IMasksManifest, ITemplateManifest} from '../interfaces/masks-manifest';

@Injectable()
export class MasksService {

  /**
   * @type {string}
   */
  private manifestPath = 'masks.json';

  /**
   * Constructor
   *
   * @param {StorageService} channelStorageService
   */
  constructor(private channelStorageService: ChannelStorageService) {
  }

  /**
   * Load from parsed zip file
   *
   * @param {any} files
   * @returns {Promise<void>}
   */
  async loadFromFiles(files: any): Promise<void> {
    // Get manifest
    if (typeof files[this.manifestPath] === 'undefined') {
      throw new Error(`Manifest file not found in ${this.manifestPath}`);
    }
    const manifest: IMasksManifest = JSON.parse(files[this.manifestPath]);
    // Parse content
    const channels = await Promise.all(manifest.channels.map((channel: IChannelManifest) => {
      return this._loadChannel(channel, files);
    }));
    // Load new content
    await channels.map((channel: Channel) => async () => {
      // Clean previous version
      await this.channelStorageService.remove(channel);
      // Save new
      await this.channelStorageService.add(channel);
    }).reduce((p, fn) => p.then(fn), Promise.resolve());
  }

  /**
   * Load a single template
   *
   * @param {ITemplateManifest} template
   * @param {any} files
   * @return {Promise<ITemplateBase>}
   * @private
   */
  private async _loadTemplate(template: ITemplateManifest, files: any): Promise<ITemplateBase> {

    // Get content
    if (typeof files[template.content] === 'undefined') {
      throw new Error(`Manifest file not found in ${this.manifestPath}`);
    }
    // Get content from files
    template.content = files[template.content];

    return template;
  }

  /**
   * Load a single channel
   *
   * @param {IChannelManifest} channel
   * @param {any} files
   * @return {Promise<Channel>}
   * @private
   */
  private async _loadChannel(channel: IChannelManifest, files: any): Promise<Channel> {

    // Get templates contents
    const templates = await Promise.all(channel.masks.map((t) => this._loadTemplate(t, files)));

    // Create and populate channel
    const output = new Channel();
    output.fromObject({
      id: channel.id,
      name: channel.name,
      templates
    });

    return output;
  }

}
