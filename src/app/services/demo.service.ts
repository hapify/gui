import { Injectable } from '@angular/core';
import {ConfigService} from './config.service';
import {StorageService as ModelStorageService, Model} from '../model/model.module';
import {StorageService as ChannelStorageService, Channel, ITemplateBase} from '../channel/channel.module';
import {DemoManifest, DemoChannel, DemoTemplate, DemoModel} from '../interfaces/demo-manifest';

@Injectable()
export class DemoService {

  /**
   * Constructor
   */
  constructor(private configService: ConfigService,
              private modelStorageService: ModelStorageService,
              private channelStorageService: ChannelStorageService) { }

  /**
   * Clean all models and channels
   *
   * @private
   * @returns {Promise<void>}
   */
  private async _clean(): Promise<void> {

    // Clean all models
    await this.modelStorageService.clear();

    // Clean all channels
    await this.channelStorageService.clear();
  }

  /**
   * Load a single template
   *
   * @param {DemoTemplate} template
   * @return {Promise<ITemplateBase>}
   * @private
   */
  private async _loadTemplate(template: DemoTemplate): Promise<ITemplateBase> {

    // Get content
    const url = `${this.configService.getDemoBaseUri()}/${template.content}`;
    const result = await fetch(url, {cache: 'no-store'});
    if (result.status !== 200) {
      throw new Error(`Error while reading template at ${result.url}. Status: ${result.status} ${result.statusText}.`);
    }
    // Get content from result
    template.content = await result.text();

    return template;
  }

  /**
   * Load a single channel
   *
   * @param {DemoChannel} channel
   * @return {Promise<Channel>}
   * @private
   */
  private async _loadChannel(channel: DemoChannel): Promise<Channel> {

    // Get templates contents
    const templates = await Promise.all(channel.templates.map((t) => this._loadTemplate(t)));

    // Create and populate channel
    const output = new Channel();
    channel.templates = templates;
    output.fromObject(channel);

    return output;
  }

  /**
   * Load a single channel
   *
   * @param {DemoModel} model
   * @return {Promise<Model>}
   * @private
   */
  private async _loadModel(model: DemoModel): Promise<Model> {

    // Create and populate model
    const output = new Model();
    output.fromObject(model);

    return output;
  }

  /**
   * Parse the demo files and load them
   *
   * @returns {Promise<void>}
   */
  async load(): Promise<void> {

    // Get the manifest
    const url = `${this.configService.getDemoBaseUri()}/${this.configService.getDemoManifest()}`;
    const result = await fetch(url, {cache: 'no-store'});
    if (result.status !== 200) {
      throw new Error(`Error while reading manifest at ${result.url}. Status: ${result.status} ${result.statusText}.`);
    }
    const manifest: DemoManifest = await result.json();

    // Clean the storage if necessary
    if (manifest.clean) {
      await this._clean();
    }

    // Load and save channels
    await Promise.all(manifest.channels.map(async (c) => {
      const channel = await this._loadChannel(c);
      await this.channelStorageService.add(channel);
    }));

    // Load and save models
    await Promise.all(manifest.models.map(async (m) => {
      const model = await this._loadModel(m);
      await this.modelStorageService.add(model);
    }));

  }

}
