import { Injectable } from '@angular/core';
import { WebSocketService } from '@app/services/websocket.service';
import { WebSocketMessages } from '@app/interfaces/websocket-message';
import { IInfo } from '@app/interfaces/info';
import { Lock } from '@app/class/Lock';

@Injectable()
export class InfoService extends Lock {
	/** Stores the infos */
	private _info: IInfo;

	/** Constructor */
	constructor(private webSocketService: WebSocketService) {
		super();
	}

	/** Get info once and store them */
	async info(): Promise<IInfo> {
		await this.wait('info');
		if (!this._info) {
			this.lock('info');
			this._info = await this.webSocketService.send(
				WebSocketMessages.GET_INFO
			);
			this.unlock('info');
		}
		return this._info;
	}
}
