import { Injectable } from '@angular/core';
import { IValidatorResult } from '../interfaces/validator-result';
import { IModel } from '@app/model/interfaces/model';
import * as md5 from 'md5';
import { WebSocketService } from '@app/services/websocket.service';
import { WebSocketMessages } from '@app/interfaces/websocket-message';

@Injectable()
export class ValidatorService {
	/** Cache stack */
	private cache: { [key: string]: IValidatorResult } = {};

	/**
	 * Constructor
	 */
	constructor(private webSocketService: WebSocketService) {}

	/**
	 * Run validation on a single model for a single channel
	 *
	 * @param {string} script
	 * @param {IModel} model
	 * @return {Promise<IValidatorResult>}
	 */
	async run(script: string, model: IModel): Promise<IValidatorResult> {
		// No script, no error
		if (typeof script === 'undefined' || script.length === 0) {
			return {
				errors: [],
				warnings: []
			};
		}

		// Get cache
		const hash = this.hash(script, model);
		if (typeof this.cache[hash] !== 'undefined') {
			return this.cache[hash];
		}

		const result = await this.webSocketService.send(
			WebSocketMessages.VALIDATE_MODEL,
			{
				model,
				content: script
			}
		);

		// Save cache
		this.cache[hash] = result;

		return result;
	}

	private hash(script: string, model: IModel): string {
		const m = model.toObject();
		delete m.id;
		const modelHash = md5(JSON.stringify(m));
		const scriptHash = md5(script);
		return `${modelHash}-${scriptHash}`;
	}
}
