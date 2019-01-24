import { Injectable } from '@angular/core';
import { IValidatorResult } from '../interfaces/validator-result';
import { IModel } from '@app/model/interfaces/model';
import * as md5 from 'md5';
import { environment } from '@env/environment';
import { RichError } from '@app/class/RichError';
import * as ErrorStackParser from 'error-stack-parser';

const VoidContext = {
	// disallowed
	global: undefined,
	process: undefined,
	module: undefined,
	require: undefined,
	document: undefined,
	window: undefined,
	Window: undefined,
	// no evil...
	eval: undefined,
	Function: undefined // locally define all potential global vars
};

@Injectable()
export class ValidatorService {
	/** Cache stack */
	private cache: { [key: string]: IValidatorResult } = {};

	/**
	 * Constructor
	 */
	constructor() {}

	/**
	 * Run validation on a single model for a single channel
	 *
	 * @param {string} script
	 * @param {IModel} model
	 * @return {Promise<IValidatorResult>}
	 */
	async run(script: string, model: IModel): Promise<IValidatorResult> {
		// Get cache
		const hash = this.hash(script, model);
		if (typeof this.cache[hash] !== 'undefined') {
			return this.cache[hash];
		}

		// No script, no error
		if (typeof script === 'undefined' || script.length === 0) {
			return {
				errors: [],
				warnings: []
			};
		}

		const result = await this.eval(script, model);

		if (
			!(
				result &&
				result.errors instanceof Array &&
				result.warnings instanceof Array
			)
		) {
			throw new RichError(
				'Invalid validator output. Must returns { errors: string[], warnings: string[] }',
				{
					code: 5009,
					type: 'ConsoleValidatorOutputError'
				}
			);
		}

		// Save cache
		this.cache[hash] = result;

		return result;
	}

	/** Run eval */
	private async eval(
		content: string,
		model: IModel
	): Promise<IValidatorResult> {
		try {
			const final = `const t = setTimeout(() => reject(new Error('TIMEOUT')), ${
				environment.validator.timeout
			});
const r = function() {
${content}
}();
clearTimeout(t); resolve(r);`;
			const results = await new Promise((resolve, reject) => {
				new Function(
					'model',
					'resolve',
					'reject',
					...Object.keys(VoidContext),
					final
				)(model, resolve, reject, ...Object.values(VoidContext));
			});
			return results as IValidatorResult;
		} catch (error) {
			// Timeout error
			if (error.message === 'TIMEOUT') {
				throw new RichError(
					`Template processing timed out (${
						environment.validator.timeout
					}ms)`,
					{
						code: 5008,
						type: 'ConsoleValidatorTimeoutError'
					}
				);
			}

			// Format error
			error.stack = error.stack.replace(
				/eval at <anonymous> \((.*):([0-9]+):([0-9]+)\), /g,
				''
			); // Help error parser a little bit
			const { lineNumber, columnNumber } = ErrorStackParser.parse(
				error
			)[0];
			const lineOffset = -4;
			throw new RichError(error.message, {
				code: 5007,
				type: 'ConsoleValidatorEvaluationError',
				details: `Error: ${error.message}. Line: ${lineNumber +
					lineOffset}, Column: ${columnNumber}`,
				lineNumber: lineNumber + lineOffset,
				columnNumber
			});
		}
	}

	private hash(script: string, model: IModel): string {
		const m = model.toObject();
		delete m.id;
		const modelHash = md5(JSON.stringify(m));
		const scriptHash = md5(script);
		return `${modelHash}-${scriptHash}`;
	}
}
