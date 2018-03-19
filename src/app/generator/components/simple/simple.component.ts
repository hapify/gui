import {Component, OnInit} from '@angular/core';
import {StorageService as ModelStorageService, IModel} from '../../../model/model.module';
import {StorageService as ChannelStorageService, IChannel, ITemplate} from '../../../channel/channel.module';
import {GeneratorService} from '../../services/generator.service';
import {IGeneratorResult} from '../../interfaces/generator-result';
import {AceService} from '../../../services/ace.service';

@Component({
  selector: 'app-generator-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss']
})
export class SimpleComponent implements OnInit {

  /**
   * Constructor
   *
   * @param modelStorageService
   * @param channelStorageService
   * @param generatorService
   */
  constructor(public aceService: AceService,
              private modelStorageService: ModelStorageService,
              private channelStorageService: ChannelStorageService,
              private generatorService: GeneratorService) {
  }

  /**
   * Stored models
   *
   * @type {IModel[]}
   */
  models: IModel[] = [];
  /**
   * Stored channels
   *
   * @type {IChannel[]}
   */
  channels: IChannel[] = [];

  /**
   * Selected model
   *
   * @type {IModel}
   */
  model: IModel = null;
  /**
   * Selected channel
   *
   * @type {IChannel}
   */
  channel: IChannel = null;
  /**
   * Selected template
   *
   * @type {ITemplate}
   */
  template: ITemplate = null;

  /**
   * Generation results
   */
  result: IGeneratorResult;

  /**
   * Generation error
   */
  error: string;

  /**
   * @inheritDoc
   */
  ngOnInit() {
    // Load models and channels
    Promise.all([
      this.modelStorageService.list(),
      this.channelStorageService.list()
    ]).then(([models, channels]) => {
      this.models = models;
      this.channels = channels;
    });
  }

  /**
   * Called when the use select a channel
   *
   * @param $event
   */
  onChannelChange($event) {
    // Clean results and error
    this.result = null;
    this.error = null;
    this.template = null;
    this.model = null;
  }

  /**
   * Called when the use select a model or a template
   *
   * @param $event
   */
  onChange($event) {
    // Clean results and error
    this.result = null;
    this.error = null;
    // Leave if not possible
    if (!this.template || (this.template.needsModel() && !this.model)) {
      return;
    }
    // Run generation
    this.generatorService.run(this.template, this.model)
      .then((result) => {
        this.result = result;
      })
      .catch((e) => {
        this.error = `${e.message}\n\n${e.stack}`;
      });
  }

  /**
   * Called when the use click on download
   *
   * @param $event
   */
  onDownload($event) {
    // Generate ZIP
    this.generatorService.download(this.models, this.channel)
      .catch((e) => {
        // Clean results and error
        this.result = null;
        this.error = `${e.message}\n\n${e.stack}`;
      });
  }

}
