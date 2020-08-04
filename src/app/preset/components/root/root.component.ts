import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { IPreset } from '../../interfaces/preset';
import { IModel } from '@app/model/interfaces/model';

interface PresetMergeResults {
	created: IModel[];
	updated: IModel[];
}

@Component({
	selector: 'app-preset-root',
	templateUrl: './root.component.html',
	styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit {
	@Output() presetApplied = new EventEmitter<PresetMergeResults>();

	/** Constructor */
	constructor(private storageService: StorageService) {}

	/** Preset instances */
	public presets: IPreset[];

	ngOnInit() {
		this.updatePresets();
	}

	/** Update presets with storage */
	protected async updatePresets(): Promise<void> {
		this.presets = await this.storageService.list();
	}
}
