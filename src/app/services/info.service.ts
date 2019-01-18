import { Injectable } from '@angular/core';
import { WebSocketService } from '@app/services/websocket.service';
import { WebSocketMessages } from '@app/interfaces/websocket-message';
import { IInfo } from '@app/interfaces/info';

@Injectable()
export class InfoService {
	/** Stores the infos */
	private _info: IInfo;

	/** Constructor */
	constructor(private webSocketService: WebSocketService) {}

	/** Get info once and store them */
	async info(): Promise<IInfo> {
		if (!this._info) {
			this._info = await this.webSocketService.send(
				WebSocketMessages.GET_INFO
			);
		}
		return this._info;
	}
}
