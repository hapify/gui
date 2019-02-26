import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { IModel, IModelBase } from '../../interfaces/model';
import { environment } from '@env/environment';
import { InfoService } from '@app/services/info.service';
import { IInfo } from '@app/interfaces/info';
import { WebSocketService } from '@app/services/websocket.service';
import { WebSocketMessages } from '@app/interfaces/websocket-message';
import { MatDialog } from '@angular/material';
import { DialogPremiumComponent } from '@app/components/common/dialog-premium/dialog-premium.component';
@Component({
	selector: 'app-model-root',
	templateUrl: './root.component.html',
	styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
	/** Constructor */
	constructor(
		private storageService: StorageService,
		private infoService: InfoService,
		private webSocketService: WebSocketService,
		private dialog: MatDialog
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
	async onClone(model: IModel): Promise<void> {
		// Get model from CLI
		const modelObject = (await this.webSocketService.send(
			WebSocketMessages.NEW_MODEL,
			{
				name: model.name
			}
		)) as IModelBase;
		// Create clone and copy temp id
		const clone = model.clone();
		clone.id = modelObject.id;
		// Clone the model
		this.storageService.add(clone).then(() => this.updateModels());
	}

	/**
	 * Called when the user update the model
	 */
	onCreate(model: IModel): void {
		// Check length
		if (this.info && this.models.length >= this.info.limits.models) {
			this.dialog.open(DialogPremiumComponent);
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
	async updateModels(): Promise<void> {
		this.modelsAreLoaded = false;
		this.models = await this.storageService.list();
		this.modelsAreLoaded = true;
		this.addingNewModel = false;
	}
}
