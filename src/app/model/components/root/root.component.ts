import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {IModel} from '../../interfaces/model';
import {ModelsDownloaderService} from '../../../loader/services/models-downloader.service';

@Component({
  selector: 'app-model-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

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
   * Update models with storage
   *
   * @returns {Promise<void>}
   */
  protected updateModels(): Promise<void> {
    return this.storageService.list()
      .then((models) => {
        models.sort((a, b) => a.name.localeCompare(b.name));
        this.models = models;
      });
  }

  /**
   * Call when user click on download
   */
  onDownload() {
    this.modelsDownloaderService.dowloadAsJson();
  }

}
