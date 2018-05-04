import {Injectable} from '@angular/core';
import {StorageService as BaseStorageService} from '../../services/storage.service';
import {Model} from '../classes/model';
import {IModel} from '../interfaces/model';

@Injectable()
export class StorageService extends BaseStorageService {

  /**
   * Returns a new instance
   *
   * @protected
   * @returns {IModel}
   */
  protected instance(): IModel {
    return new Model();
  }

  /**
   * Returns the name of the bucket to store data
   *
   * @protected
   * @returns {string}
   */
  protected bucket(): string {
    return 'models';
  }

  /**
   * @inheritDoc
   */
  async list(): Promise<IModel[]> {
    const list = <IModel[]>(await super.list());
    list.sort((a: IModel, b: IModel) => a.name.localeCompare(b.name));
    return list;
  }

  /**
   * @inheritDoc
   */
  find(id: string): Promise<IModel> {
    return super.find(id);
  }

}
