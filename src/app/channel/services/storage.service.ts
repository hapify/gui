import { Injectable } from '@angular/core';
import { StorageService as BaseStorageService } from '../../services/storage.service';
import { Channel } from '../classes/channel';
import { IChannel } from '../interfaces/channel';
import { WebSocketMessages } from '../../interfaces/websocket-message';

@Injectable()
export class StorageService extends BaseStorageService<IChannel> {
	/** @inheritDoc */
	protected instance(): IChannel {
		return new Channel();
	}
	/** @inheritDoc */
	protected getMessageId(): string {
		return WebSocketMessages.GET_CHANNELS;
	}
	/** @inheritDoc */
	protected setMessageId(): string {
		return WebSocketMessages.SET_CHANNELS;
	}
	/** @inheritDoc */
	list(): Promise<IChannel[]> {
		return super.list();
	}
	/** @inheritDoc */
	find(id: string): Promise<IChannel> {
		return super.find(id);
	}
	/** @inheritDoc */
	sort(instances: IChannel[]): void {
		instances.sort((a, b) => a.name.localeCompare(b.name));
		for (const instance of instances) {
			instance.templates.sort((a, b) => a.path.localeCompare(b.path));
		}
	}
}
