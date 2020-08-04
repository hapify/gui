import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { IChannel } from '../../interfaces/channel';

@Component({
	selector: 'app-channel-root',
	templateUrl: './root.component.html',
	styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit {
	/** @type {IChannel[]} Channel instances */
	public channels: IChannel[] = [];
	/** Constructor */
	constructor(private storageService: StorageService) {}
	/** @inheritDoc */
	ngOnInit() {
		this.updateChannels();
	}
	/**
	 * Update channels with storage
	 * @returns {Promise<void>}
	 */
	protected async updateChannels(): Promise<void> {
		this.channels = await this.storageService.list();
	}
}
