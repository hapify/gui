import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {IModel} from '../../interfaces/model';

@Component({
  selector: 'app-model-root',
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
        this.models = models.reverse();
      });
  }

}
