import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { StorageService as ModelStorageService } from '../../../model/model.module';
import { IPreset } from '../../interfaces/preset';
import { AceService } from '@app/services/ace.service';
import { MessageService } from '@app/services/message.service';

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
		private messageService: MessageService
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
		// Add or update each models
		const updated = [];
		const created = [];
		for (const model of preset.models) {
			const existing = (await this.modelStorageService.list()).find(
				m => m.name === model.name
			);
			if (existing) {
				// Add or skip each fields
				let shouldSave = false;
				for (const field of model.fields) {
					if (!existing.fields.some(f => f.name === field.name)) {
						existing.addField(field);
						shouldSave = true;
					}
				}
				if (shouldSave) {
					await this.modelStorageService.update(existing);
					updated.push(existing);
				}
			} else {
				const clone = model.clone();
				await this.modelStorageService.add(clone);
				created.push(clone);
			}
		}
		// Show message to user...
		let message = created.length
			? `Did create model(s) ${created.map(m => m.name).join(', ')}`
			: 'No model created';
		message += '. ';
		message += updated.length
			? `Did update model(s) ${updated.map(m => m.name).join(', ')}`
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
