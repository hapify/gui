import { Injectable } from '@angular/core';
import { StorageService as BaseStorageService } from '../../services/storage.service';
import { Model } from '../classes/model';
import { IModel } from '../interfaces/model';
import { WebSocketMessages } from '../../interfaces/websocket-message';

@Injectable()
export class StorageService extends BaseStorageService<IModel> {
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
	list(): Promise<IModel[]> {
		return super.list();
	}
	/** @inheritDoc */
	find(id: string): Promise<IModel> {
		return super.find(id);
	}
	/** @inheritDoc */
	sort(instances: IModel[]): void {
		instances.sort((a, b) => a.name.localeCompare(b.name));
	}
}
