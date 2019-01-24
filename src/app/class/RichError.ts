export interface RichErrorData {
	type: string;
	code: number;
}
export class RichError implements Error {
	name: string;
	message: string;
	stack?: string;
	data?: RichErrorData;
	constructor(message: string, data?: RichErrorData) {
		this.name = 'RichError';
		this.message = message;
		if (data) {
			this.data = data;
		}
	}
	static from(payload: any) {
		return new this(payload.message, payload.data);
	}
	details(): string {
		let output = this.message;
		if (this.data) {
			output += '\n';
			output += `\nType: ${this.data.type}`;
			output += `\nCode: ${this.data.code}`;
		}
		return output;
	}
}
