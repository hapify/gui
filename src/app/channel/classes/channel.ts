import { IChannel, IChannelBase } from '../interfaces/channel';
import { ITemplate, ITemplateBase } from '../interfaces/template';
import { Template } from './template';

export class Channel implements IChannel {
	/**
	 * Constructor
	 * Auto-generate unique id
	 */
	constructor() {
		this.id = this.guid();
	}

	/**
	 * @inheritDoc
	 */
	public id: string;
	/**
	 * @inheritDoc
	 */
	public name = '';
	/**
	 * @inheritDoc
	 */
	public description = null;
	/**
	 * @inheritDoc
	 */
	public logo = null;
	/**
	 * @inheritDoc
	 */
	public validator = '';
	/**
	 * @inheritDoc
	 */
	public templates: ITemplate[] = [];

	/**
	 * Randomly generate id
	 *
	 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
	 * @returns {string}
	 */
	protected guid(): string {
		function _p8(s?: boolean) {
			const p = (Math.random().toString(16) + '000000000').substr(2, 8);
			return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
		}

		return _p8() + _p8(true) + _p8(true) + _p8();
	}

	/**
	 * @inheritDoc
	 */
	public newTemplate(): ITemplate {
		return new Template(this);
	}

	/**
	 * @inheritDoc
	 */
	public addTemplate(template: ITemplate): void {
		this.templates.push(template);
	}

	/**
	 * @inheritDoc
	 */
	public removeTemplate(template: ITemplate): void {
		this.templates = this.templates.filter((t: ITemplate) => t !== template);
	}

	/**
	 * @inheritDoc
	 */
	public fromObject(object: IChannelBase): void {
		this.id = object.id;
		this.name = object.name;
		this.description = object.description;
		this.logo = object.logo;
		this.templates = object.templates.map(
			(templateBase: ITemplateBase): ITemplate => {
				const template = this.newTemplate();
				template.fromObject(templateBase);
				return template;
			}
		);
		this.validator = object.validator;
	}

	/**
	 * @inheritDoc
	 */
	public toObject(): IChannelBase {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			logo: this.logo,
			templates: this.templates
				.filter((template: ITemplate): boolean => !template.isEmpty())
				.map((template: ITemplate): ITemplateBase => template.toObject()),
			validator: this.validator,
		};
	}

	/**
	 * @inheritDoc
	 */
	public isEmpty(): boolean {
		const nameIsEmpty = typeof this.name !== 'string' || this.name === null || this.name.length === 0;
		const templatesAreEmpty = this.templates.every((template: ITemplate): boolean => template.isEmpty());

		return nameIsEmpty || templatesAreEmpty;
	}

	/**
	 * @inheritDoc
	 */
	public filter(): void {
		this.templates = this.templates.filter((template: ITemplate): boolean => {
			return !template.isEmpty();
		});
	}
}
