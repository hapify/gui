import { ITemplate, ITemplateBase } from '../interfaces/template';
import { TemplateEngine } from '../interfaces/template-engine.enum';
import { TemplateInput } from '../interfaces/template-input.enum';
import { IChannel } from '../interfaces/channel';

export class Template implements ITemplate {
	private _channel: IChannel;

	constructor(channel: IChannel) {
		this._channel = channel;
	}
	/** Stores the path value managed by getter/setter */
	private _path = '';
	/** Stores the path value managed by getter/setter */
	private _type = null;
	public engine = TemplateEngine.Hpf;
	public input = TemplateInput.One;
	public content = '';

	/** Split a string into path parts */
	private static split(path: string): string[] {
		return path
			.trim()
			.split(/[\/\\]/g)
			.filter((x) => x.length);
	}

	set path(value) {
		this._path = Template.split(value).join('/');
		const parts = this._path.split('.');
		this._type = parts.length > 1 ? parts[parts.length - 1] : null;
	}

	get path() {
		return this._path;
	}

	get type() {
		return this._type;
	}

	public fromObject(object: ITemplateBase): void {
		this.path = object.path;
		this.engine = object.engine;
		this.input = object.input;
		this.content = object.content;
	}

	public toObject(): ITemplateBase {
		return {
			path: this.path,
			engine: this.engine,
			input: this.input,
			content: this.content,
		};
	}

	public extension(): string {
		if (this.engine === TemplateEngine.Hpf) {
			return 'hpf';
		}
		return 'js';
	}

	public aceMode(): string {
		if (this.engine === TemplateEngine.Hpf) {
			return 'hpf';
		}
		return 'js';
	}

	public isEmpty(): boolean {
		return typeof this.content !== 'string' || this.content === null || this.content.trim().length === 0;
	}

	public needsModel(): boolean {
		return this.input === TemplateInput.One;
	}

	public clone(): ITemplate {
		const output = new Template(this._channel);
		output.fromObject(this.toObject());

		return output;
	}

	public channel(): IChannel {
		return this._channel;
	}

	splitPath(): string[] {
		return Template.split(this.path);
	}
}
