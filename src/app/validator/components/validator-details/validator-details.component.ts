import {
	Component,
	OnInit,
	OnDestroy,
	Input,
	Injector,
	EventEmitter
} from '@angular/core';
import { ValidatorService } from '../../services/validator.service';
import { StorageService as ChannelStorageService } from '@app/channel/services/storage.service';
import { StorageService as ModelStorageService } from '@app/model/services/storage.service';
import { IModel } from '@app/model/interfaces/model';
import { IChannel } from '@app/channel/interfaces/channel';

@Component({
	selector: 'app-validator-details',
	templateUrl: './validator-details.component.html',
	styleUrls: ['./validator-details.component.scss']
})
export class ValidatorDetailsComponent implements OnInit, OnDestroy {
	/** @type {ChannelStorageService} The channel storage service */
	protected channelStorageService: ChannelStorageService;
	/** @type {ModelStorageService} The model storage service */
	protected modelStorageService: ModelStorageService;
	/** @type {ValidatorService} The validator service */
	protected validatorService: ValidatorService;
	/** @type {IModel} */
	protected modelValue: IModel;
	/** @type {IModel[]} */
	protected models: IModel[] = [];
	/** @type {IChannel} */
	protected channelValue: IChannel;
	/** @type {IChannel[]} */
	protected channels: IChannel[] = [];
	/** @type {EventEmitter<void>} Notify changes */
	protected signalSubscription: EventEmitter<void>;
	/** @type {boolean} Denotes if the process can be ran */
	protected initialized = false;
	/** @type {string} Errors & warnings details */
	details: string = null;

	/** Model getter */
	get model() {
		return this.modelValue;
	}

	/** @param val Model setter */
	@Input()
	set model(val: IModel) {
		this.modelValue = val;
		this.run();
	}

	/** Channel getter */
	get channel() {
		return this.channelValue;
	}

	/** @param val Channel setter */
	@Input()
	set channel(val: IChannel) {
		this.channelValue = val;
		this.run();
	}

	/** @param val Set signal */
	@Input()
	set signal(val: EventEmitter<void>) {
		// Unsubscribe previous
		if (this.signalSubscription) {
			this.signalSubscription.unsubscribe();
		}
		this.signalSubscription = val.subscribe(() => {
			this.run();
		});
	}

	/**
	 * Constructor
	 *
	 * @param {Injector} injector
	 */
	constructor(protected injector: Injector) {}

	/**
	 * On init
	 */
	ngOnInit() {
		// Avoid circular dependency
		this.channelStorageService = this.injector.get(ChannelStorageService);
		this.modelStorageService = this.injector.get(ModelStorageService);
		this.validatorService = this.injector.get(ValidatorService);

		// Load channels and models once
		Promise.all([
			this.channelStorageService.list().then(channels => {
				this.channels = channels;
			}),
			this.modelStorageService.list().then(models => {
				this.models = models;
			})
		]).then(() => {
			this.initialized = true;
			this.run();
		});
	}

	/**
	 * Destroy
	 */
	ngOnDestroy() {
		if (this.signalSubscription) {
			this.signalSubscription.unsubscribe();
		}
	}

	/**
	 * Run the process for Models x Channels
	 */
	protected async run() {
		// Check if possible
		if (!this.initialized) {
			return;
		}

		// Start process
		const channels =
			typeof this.channelValue === 'undefined'
				? this.channels
				: [this.channelValue];
		const models =
			typeof this.modelValue === 'undefined'
				? this.models
				: [this.modelValue];

		// Stop process on first error
		this.details = '';
		for (const channel of channels) {
			for (const model of models) {
				const { errors, warnings } = await this.validatorService.run(
					channel.validator,
					model
				);
				// Ignore details
				if (errors.length === 0 && warnings.length === 0) {
					continue;
				}
				// Title
				this.details += `${channel.name} x ${model.name}:\n`;
				if (errors.length > 0) {
					this.details += `  ${errors.length} error${
						errors.length > 1 ? 's' : ''
					}\n`;
					this.details += `    ${errors.join('\n    ')}${
						errors.length ? '\n' : ''
					}\n`;
				}
				if (warnings.length > 0) {
					this.details += `  ${warnings.length} warning${
						warnings.length > 1 ? 's' : ''
					}\n`;
					this.details += `    ${warnings.join('\n    ')}${
						warnings.length ? '\n' : ''
					}\n`;
				}
			}
		}
		this.details = this.details.trim();

		// Null if empty
		if (this.details.length === 0) {
			this.details = null;
		}
	}
}
