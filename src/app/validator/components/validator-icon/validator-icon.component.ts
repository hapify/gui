import { Component } from '@angular/core';
import { ValidatorDetailsComponent } from '../validator-details/validator-details.component';

@Component({
	selector: 'app-validator-icon',
	templateUrl: './validator-icon.component.html',
	styleUrls: ['./validator-icon.component.scss']
})
export class ValidatorIconComponent extends ValidatorDetailsComponent {
	/** @type {string} Pre-computed error level */
	level = 'undefined';
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
		let hasError = false;
		let hasWarning = false;
		for (const channel of channels) {
			if (hasError) {
				break;
			}
			for (const model of models) {
				if (hasError) {
					break;
				}
				const result = await this.validatorService.run(
					channel.validator,
					model
				);
				hasError = hasError || result.errors.length > 0;
				hasWarning = hasWarning || result.warnings.length > 0;
			}
		}

		if (hasError) {
			this.level = 'error';
		} else if (hasWarning) {
			this.level = 'warning';
		} else {
			this.level = 'valid';
		}
	}
}
