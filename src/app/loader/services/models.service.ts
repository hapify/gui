import {Injectable} from '@angular/core';
import {StorageService} from '../../model/services/storage.service';

import FileSaver from 'file-saver';

@Injectable()
export class ModelsService {

  /**
   * Constructor
   *
   * @param {StorageService} storageService
   */
  constructor(private storageService: StorageService) {}

  /**
   * Download all models as JSON
   *
   * @returns {Promise<void>}
   */
  async dowloadAsJson() {
    const models = (await this.storageService.list())
      .map((model) => model.toObject());
    const filename = 'models.json';
    const file = new Blob([JSON.stringify(models, null, 4)], {type: 'application/json'});
    FileSaver.saveAs(file, filename);
  }
}
