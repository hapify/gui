import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { StorageService as ModelStorageService } from '../../../model/model.module';
import { IPreset } from '../../interfaces/preset';

@Component({
	selector: 'app-preset-root',
	templateUrl: './root.component.html',
	styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
	/**
	 * Constructor
	 * @param {StorageService} storageService
	 * @param {ModelStorageService} modelStorageService
	 */
	constructor(
		private storageService: StorageService,
		private modelStorageService: ModelStorageService
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
		for (const model of preset.models) {
			const existing = await this.modelStorageService.find(model.id);
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
				}
			} else {
				await this.modelStorageService.add(model);
			}
		}
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
