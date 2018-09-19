import {Injectable} from '@angular/core';
import {StorageService as BaseStorageService} from '../../services/storage.service';
import {Model} from '../classes/model';
import {IModel} from '../interfaces/model';
import {WebSocketMessages} from '../../interfaces/websocket-message';

@Injectable()
export class StorageService extends BaseStorageService {
  
  /** @inheritDoc */
  protected instance(): IModel {
    return new Model();
  }
  /** @inheritDoc */
  protected getMessageId(): string {
    return WebSocketMessages.GET_MODELS;
  }
  /** @inheritDoc */
  protected setMessageId(): string {
    return WebSocketMessages.SET_MODELS;
  }
  /** @inheritDoc */
  async list(): Promise<IModel[]> {
    const list = <IModel[]>(await super.list());
    list.sort((a: IModel, b: IModel) => a.name.localeCompare(b.name));
    return list;
  }
  /** @inheritDoc */
  find(id: string): Promise<IModel> {
    return super.find(id);
  }

}
