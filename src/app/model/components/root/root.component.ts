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
import { MessageService } from '@app/services/message.service';

declare const navigator: any;

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
		private dialog: MatDialog,
		private messageService: MessageService
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
		// Create a clone
		const clone = model.clone();

		// Create new model from CLI
		const modelObject = (await this.webSocketService.send(
			WebSocketMessages.NEW_MODEL,
			{
				name: `Copy of ${model.name}`
			}
		)) as IModelBase;

		// Replace self reference
		clone.fields
			.filter(f => f.type === 'entity' && f.reference === clone.id)
			.forEach(f => (f.reference = modelObject.id));

		// Copy temp id and new name
		clone.name = modelObject.name;
		clone.id = modelObject.id;

		// Clone the model
		this.storageService.add(clone).then(() => this.updateModels());
	}

	/**
	 * Called when the user update the model
	 */
	onCreate(model: IModel): void {
		// Check length
		if (
			this.info &&
			this.models &&
			this.models.length >= this.info.limits.models
		) {
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

	/** Called when the user copy the model */
	async onCopy(model: IModel): void {
		if (navigator.clipboard) {
			await navigator.clipboard
				.writeText(JSON.stringify(model.toObject(), null, 2))
				.then(async () => {
					this.messageService.info(
						await this.messageService.translateKey(
							'clipboard_copy-success',
							{
								model: model.name
							}
						)
					);
				})
				.catch(error => {
					this.messageService.error(error);
				});
		} else {
			this.messageService.warning(
				await this.messageService.translateKey(
					'clipboard_not_supported'
				)
			);
		}
	}

	/** Called when the user paste the model */
	async onPaste(): void {
		if (navigator.clipboard) {
			await navigator.clipboard
				.readText()
				.then(async text => {
					// Convert string to model
					const data: IModelBase = JSON.parse(text);
					const clone = this.storageService.instance();
					clone.fromObject(data);

					// Create a new model from CLI
					const modelObject = (await this.webSocketService.send(
						WebSocketMessages.NEW_MODEL,
						{
							name: clone.name
						}
					)) as IModelBase;

					// Replace self reference
					clone.fields
						.filter(
							f => f.type === 'entity' && f.reference === clone.id
						)
						.forEach(f => (f.reference = modelObject.id));

					// Remove non-existing references
					const fieldsIds = (await this.storageService.list()).map(
						m => m.id
					);
					fieldsIds.push(modelObject.id);
					clone.fields
						.filter(
							f =>
								f.type === 'entity' &&
								!fieldsIds.includes(f.reference)
						)
						.forEach(f => (f.reference = null));

					// Copy new id
					clone.id = modelObject.id;

					// Clone the model
					await this.storageService.add(clone);
					await this.updateModels();
					return clone;
				})
				.then(async (model: IModel) => {
					this.messageService.info(
						await this.messageService.translateKey(
							'clipboard_paste-success',
							{
								model: model.name
							}
						)
					);
				})
				.catch(error => {
					this.messageService.error(error);
				});
		} else {
			this.messageService.warning(
				await this.messageService.translateKey(
					'clipboard_not-supported'
				)
			);
		}
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
