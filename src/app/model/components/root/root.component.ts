import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { IModel } from '../../interfaces/model';
import { environment } from '@env/environment';
import { InfoService } from '@app/services/info.service';
import { IInfo } from '@app/interfaces/info';

@Component({
	selector: 'app-model-root',
	templateUrl: './root.component.html',
	styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
	/** Constructor */
	constructor(
		private storageService: StorageService,
		private infoService: InfoService
	) {}

	private _saveTimeout;
	dTime = environment.debounceTime;
	public models: IModel[];
	public currentModel: IModel;
	public info: IInfo;

	/** Used for loader to toggle */
	modelsAreLoaded = false;
	/** Used new model atom to toggle */
	addingNewModel = false;

	/**
	 * @inheritDoc
	 */
	ngOnInit() {
		this.updateModels();
		this.infoService.info().then(info => {
			this.info = info;
			this.info.limits.models = 10;
			this.info.limits.fields = 12;
			this.info.limits.templates = 15;
		});
	}

	/**
	 * Called when the user update the model
	 */
	onDelete(model: IModel): void {
		// Delete the model
		this.storageService.remove(model).then(() => this.updateModels());
	}

	/**
	 * Called when the user update the model
	 */
	onClone(model: IModel): void {
		// Clone the model
		this.storageService.add(model.clone()).then(() => this.updateModels());
	}

	/**
	 * Called when the user update the model
	 */
	onCreate(model: IModel): void {
		// Check length
		if (this.info && this.models.length >= this.info.limits.models) {
			return;
		}
		// Store the model
		this.storageService.add(model).then(() => this.updateModels());
	}

	/** Called when the user save the model (For now, autosaving on any changes is activated) */
	onSave(model: IModel): void {
		clearTimeout(this._saveTimeout);
		this._saveTimeout = setTimeout(() => {
			// Update the model
			this.storageService.update(model);
		}, this.dTime);
	}

	/**
	 * Update models with storage
	 *
	 * @returns {Promise<void>}
	 */
	protected async updateModels(): Promise<void> {
		this.modelsAreLoaded = false;
		this.models = await this.storageService.list();
		this.modelsAreLoaded = true;
		this.addingNewModel = false;
	}
}
