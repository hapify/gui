export interface GeneratorErrorData {
	type: string;
	stack: string;
	lineNumber: number;
	columnNumber: number;
}
export class GeneratorError implements Error {
	name: string;
	message: string;
	stack?: string;
	data?: GeneratorErrorData;
	constructor(message: string, data?: GeneratorErrorData) {
		this.name = 'GeneratorError';
		this.message = message;
		if (data) {
			this.stack = data.stack;
			this.data = data;
		}
	}
	static from(payload: any) {
		return new GeneratorError(payload.message, payload.data);
	}
	details(): string {
		let output = `${this.name}: ${this.message}`;
		if (this.data) {
			output += '\n';
			output += `\nType: ${this.data.type}`;
			if (this.data.stack) {
				output += `\nStack: ${this.stack}`;
			}
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
