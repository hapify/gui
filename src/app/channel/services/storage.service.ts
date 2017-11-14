import {Injectable} from '@angular/core';
import {StorageService as BaseStorageService} from '../../services/storage.service';
import {Channel} from '../classes/channel';
import {IChannel} from '../interfaces/channel';

@Injectable()
export class StorageService extends BaseStorageService {

  /**
   * Returns a new instance
   *
   * @protected
   * @returns {IChannel}
   */
  protected instance(): IChannel {
    return new Channel();
  }

  /**
   * Returns the name of the bucket to store data
   *
   * @protected
   * @returns {string}
   */
  protected bucket(): string {
    return 'channels';
  }

  /**
   * @inheritDoc
   */
  list(): Promise<IChannel[]> {
    return super.list();
  }

  /**
   * @inheritDoc
   */
  find(id: string): Promise<IChannel> {
    return super.find(id);
  }

}
