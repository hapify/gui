import { ITemplate, ITemplateBase } from '../interfaces/template';
import { TemplateEngine } from '../interfaces/template-engine.enum';
import { TemplateInput } from '../interfaces/template-input.enum';
import { IChannel } from '../interfaces/channel';

export class Template implements ITemplate {
	private _channel: IChannel;

	/**
	 * @inheritDoc
	 */
	constructor(channel: IChannel) {
		this._channel = channel;
	}
	/**
	 * @inheritDoc
	 */
	public name = '';
	/**
	 * Stores the path value managed by getter/setter
	 */
	private _path = '';
	/**
	 * Stores the path value managed by getter/setter
	 */
	private _type = null;
	/**
	 * @inheritDoc
	 */
	public engine = TemplateEngine.Hpf;
	/**
	 * @inheritDoc
	 */
	public input = TemplateInput.One;
	/**
	 * @inheritDoc
	 */
	public content = '';

	/**
	 * Split a string into path parts
	 */
	private static split(path: string): string {
		return path
			.trim()
			.split(/[\/\\]/g)
			.filter(x => x.length);
	}

	/**
	 * @inheritDoc
	 */
	set path(value) {
		this._path = Template.split(value).join('/');
		const parts = this._path.split('.');
		this._type = parts.length > 1 ? parts[parts.length - 1] : null;
	}

	/**
	 * @inheritDoc
	 */
	get path() {
		return this._path;
	}

	/**
	 * @inheritDoc
	 */
	get type() {
		return this._type;
	}

	/**
	 * @inheritDoc
	 */
	public fromObject(object: ITemplateBase): void {
		this.name = object.name;
		this.path = object.path;
		this.engine = object.engine;
		this.input = object.input;
		this.content = object.content;
	}

	/**
	 * @inheritDoc
	 */
	public toObject(): ITemplateBase {
		return {
			name: this.name,
			path: this.path,
			engine: this.engine,
			input: this.input,
			content: this.content
		};
	}

	/**
	 * @inheritDoc
	 */
	public extension(): string {
		if (this.engine === TemplateEngine.Hpf) {
			return 'hpf';
		}
		return 'js';
	}

	/**
	 * @inheritDoc
	 */
	public aceMode(): string {
		if (this.engine === TemplateEngine.Hpf) {
			return 'hpf';
		}
		return 'js';
	}

	/**
	 * @inheritDoc
	 */
	public isEmpty(): boolean {
		return (
			typeof this.content !== 'string' ||
			this.content === null ||
			this.content.trim().length === 0
		);
	}

	/**
	 * @inheritDoc
	 */
	public needsModel(): boolean {
		return this.input === TemplateInput.One;
	}

	/**
	 * @inheritDoc
	 */
	public clone(): ITemplate {
		const output = new Template(this._channel);
		output.fromObject(this.toObject());

		return output;
	}

	/**
	 * @inheritDoc
	 */
	public channel(): IChannel {
		return this._channel;
	}

	/**
	 * @inheritDoc
	 */
	splitPath(): string[] {
		return Template.split(this.path);
	}
}
