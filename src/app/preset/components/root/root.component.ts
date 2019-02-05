import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { IPreset } from '../../interfaces/preset';
import { MessageService } from '@app/services/message.service';
import { WebSocketService } from '@app/services/websocket.service';
import { WebSocketMessages } from '@app/interfaces/websocket-message';
import { IModel } from '@app/model/interfaces/model';
import { ModelService } from '@app/preset/services/model.service';

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
	@Output() presetApplied = new EventEmitter<PresetMergeResults>();

	/** Constructor */
	constructor(
		private storageService: StorageService,
		// private modelStorageService: ModelStorageService,
		private messageService: MessageService,
		private webSocketService: WebSocketService,
		private modelService: ModelService
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

		this.presetApplied.emit(results);
		this.modelService.presetApplied.next(results);
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
