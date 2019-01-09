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
		// Store the model
		this.storageService.remove(model).then(() => this.updateModels());
	}

	/**
	 * Called when the user update the model
	 */
	onClone(model: IModel): void {
		// Store the model
		this.storageService.add(model.clone()).then(() => this.updateModels());
	}

	onSave(model: IModel): void {
		console.log('SAVE', model);
		this.storageService.update(model);
	}

	/**
	 * Update models with storage
	 *
	 * @returns {Promise<void>}
	 */
	protected async updateModels(): Promise<void> {
		this.models = await this.storageService.list();
	}
}
