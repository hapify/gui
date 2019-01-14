import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { IModel } from '../../interfaces/model';

@Component({
	selector: 'app-model-root',
	templateUrl: './root.component.html',
	styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
	/**
	 * Constructor
	 * @param {StorageService} storageService
	 */
	constructor(private storageService: StorageService) {}

	/**
	 * Model instances
	 *
	 * @type {IModel[]}
	 */
	public models: IModel[];

	/** Used for loader to toggle */
	modelsAreLoaded = false;
	/** Used new model atom to toggle */
	addingNewModel = false;

	/**
	 * @inheritDoc
	 */
	ngOnInit() {
		this.updateModels();
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

	/** Called when the user save the model (For now, autosaving on any changes is activated) */
	onSave(model: IModel): void {
		// Update the model
		this.storageService.update(model);
	}

	/**
	 * Update models with storage
	 *
	 * @returns {Promise<void>}
	 */
	protected async updateModels(): Promise<void> {
		this.modelsAreLoaded = false;
		this.storageService.list().then(result => {
			this.models = result;
			this.modelsAreLoaded = true;
		});
		this.addingNewModel = false;
	}
}
