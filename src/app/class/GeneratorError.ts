import { RichError, RichErrorData } from '@app/class/RichError';

export interface GeneratorErrorData extends RichErrorData {
	stack: string;
	lineNumber: number;
	columnNumber: number;
}
export class GeneratorError extends RichError {
	data?: GeneratorErrorData;
	constructor(message: string, data?: GeneratorErrorData) {
		super(message, data);
		this.name = 'GeneratorError';
		if (data) {
			this.stack = data.stack;
		}
	}
	details(): string {
		let output = super.details();
		if (this.stack) {
			output += `\nStack: ${this.stack}`;
		}
		if (this.data) {
			if (this.data.lineNumber) {
				output += `\nLine Number: ${this.data.lineNumber}`;
			}
			if (this.data.columnNumber) {
				output += `\nColumn Number: ${this.data.columnNumber}`;
			}
		}
		return output;
	}
}
