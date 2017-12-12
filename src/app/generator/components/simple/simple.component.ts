import { Component, OnInit, ElementRef } from '@angular/core';
import {StorageService as ModelStorageService, IModel} from '../../../model/model.module';
import {StorageService as ChannelStorageService, IChannel, ITemplate} from '../../../channel/channel.module';
import {GeneratorService} from '../../services/generator.service';
import {IGeneratorResult} from '../../interfaces/generator-result';
import {HighlightJsService} from 'angular2-highlight-js';

@Component({
  selector: 'app-generator-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss']
})
export class SimpleComponent implements OnInit {

  /**
   * Constructor
   *
   * @param elementRef
   * @param highlightJsService
   * @param modelStorageService
   * @param channelStorageService
   * @param generatorService
   */
  constructor(private elementRef: ElementRef,
              private highlightJsService: HighlightJsService,
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
  model: IModel;
  /**
   * Selected channel
   *
   * @type {IChannel}
   */
  channel: IChannel;
  /**
   * Selected template
   *
   * @type {ITemplate}
   */
  template: ITemplate;

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
   * Called when the use select a template
   *
   * @param $event
   */
  onTemplateChange($event) {
    // Clean results and error
    this.result = null;
    this.error = null;
    // Run generation
    this.generatorService.run(this.model, this.template)
      .then((result) => {
        this.result = result;
        setTimeout(() => {
          this.highlightJsService.highlight(this.elementRef.nativeElement.querySelector('.generated-code'));
        });
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
    // Clean results and error
    this.result = null;
    this.error = null;
    // Generate ZIP
    this.generatorService.download(this.models, this.channel)
      .catch((e) => {
        this.error = `${e.message}\n\n${e.stack}`;
      });
  }

}
