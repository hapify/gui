import {Injectable} from '@angular/core';
import {StorageService as BaseStorageService} from '../../services/storage.service';
import {Preset} from '../classes/preset';
import {IPreset} from '../interfaces/preset';
import {WebSocketMessages} from '../../interfaces/websocket-message';

@Injectable()
export class StorageService extends BaseStorageService {
  
  /** @inheritDoc */
  protected instance(): IPreset {
    return new Preset();
  }
  /** @inheritDoc */
  protected getMessageId(): string {
    return WebSocketMessages.GET_PRESETS;
  }
  /** @inheritDoc */
  protected setMessageId(): string {
    return WebSocketMessages.NA;
  }
  /** @inheritDoc */
  list(): Promise<IPreset[]> {
    return super.list();
  }
  /** @inheritDoc */
  find(id: string): Promise<IPreset> {
    return super.find(id);
  }
  /** @inheritDoc */
  sort(instances: IPreset[]): void {
    instances.sort((a, b) => a.name.localeCompare(b.name));
  }
}
