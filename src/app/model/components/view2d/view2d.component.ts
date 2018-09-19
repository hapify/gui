import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {IModel} from '../../interfaces/model';
import {ModelsDownloaderService} from '../../../loader/services/models-downloader.service';

@Component({
  selector: 'app-model-view2d',
  templateUrl: './view2d.component.html',
  styleUrls: ['./view2d.component.scss']
})
export class View2dComponent implements OnInit {

  /**
   * Constructor
   *
   * @param {StorageService} storageService
   * @param {ModelsDownloaderService} modelsDownloaderService
   */
  constructor(private storageService: StorageService,
              private modelsDownloaderService: ModelsDownloaderService) {
  }

  /**
   * Model instances
   *
   * @type {IModel[]}
   */
  public models: IModel[];

  /**
   * @inheritDoc
   */
  ngOnInit() {
    this.updateModels();
  }

  /**
   * Called when the user update the model
   */
  deleteModel(model: IModel): void {
    // Store the model
    this.storageService.remove(model)
      .then(() => this.updateModels());
  }

  /**
   * Called when the user update the model
   */
  cloneModel(model: IModel): void {
    // Store the model
    this.storageService.add(model.clone())
      .then(() => this.updateModels());
  }

  /**
   * Update models with storage
   *
   * @returns {Promise<void>}
   */
  protected async updateModels(): Promise<void> {
    this.models = await this.storageService.list();
  }

  /**
   * Call when user click on download
   */
  onDownload() {
    this.modelsDownloaderService.dowloadAsJson();
  }

}
