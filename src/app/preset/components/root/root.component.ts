import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { StorageService as ModelStorageService } from '../../../model/model.module';
import { IPreset } from '../../interfaces/preset';
import { MessageService } from '@app/services/message.service';
import { WebSocketService } from '@app/services/websocket.service';
import { WebSocketMessages } from '@app/interfaces/websocket-message';
import { IModel } from '@app/model/interfaces/model';
import { Model } from '@app/model/classes/model';

interface PresetMergeResults {
	created: IModel[];
	updated: IModel[];
}

@Component({
	selector: 'app-preset-root',
	templateUrl: './root.component.html',
	styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
	/** Constructor */
	constructor(
		private storageService: StorageService,
		private modelStorageService: ModelStorageService,
		private messageService: MessageService,
		private webSocketService: WebSocketService
	) {}

	/**
	 * Preset instances
	 *
	 * @type {IPreset[]}
	 */
	public presets: IPreset[];

	/**
	 * @inheritDoc
	 */
	ngOnInit() {
		this.updatePresets();
	}

	/**
	 * Called when the user apply the preset
	 */
	async applyPreset(preset: IPreset): Promise<void> {
		const results = (await this.webSocketService.send(
			WebSocketMessages.APPLY_PRESETS,
			{
				models: preset.models
			}
		)) as PresetMergeResults;

		// @todo Require validation from user
		await this.modelStorageService.update(
			results.updated.map(m => {
				const model = new Model();
				model.fromObject(m);
				return model;
			})
		);
		await this.modelStorageService.add(
			results.created.map(m => {
				const model = new Model();
				model.fromObject(m);
				return model;
			})
		);

		// Show message to user...
		let message = results.created.length
			? `Did create model(s) ${results.created
					.map(m => m.name)
					.join(', ')}`
			: 'No model created';
		message += '. ';
		message += results.updated.length
			? `Did update model(s) ${results.updated
					.map(m => m.name)
					.join(', ')}`
			: 'No model updated';
		this.messageService.info(message);
	}

	/**
	 * Update presets with storage
	 *
	 * @returns {Promise<void>}
	 */
	protected async updatePresets(): Promise<void> {
		this.presets = await this.storageService.list();
	}
}
