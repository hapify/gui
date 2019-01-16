import { ITemplate, ITemplateBase } from './template';
import { IStorableBase, IStorable } from '../../interfaces/storable';

export interface IChannelBase extends IStorableBase {
	/**
	 * The channel's name
	 *
	 * @type {string}
	 */
	name: string;
	/**
	 * The channel's description
	 *
	 * @type {string}
	 */
	description: string;
	/**
	 * The channel's logo
	 *
	 * @type {string}
	 */
	logo: string;
	/**
	 * The templates of the channel
	 *
	 * @type {ITemplateBase[]}
	 */
	templates: ITemplateBase[];
	/**
	 * The channel's validation script
	 *
	 * @type {string}
	 */
	validator: string;
}

export interface IChannel extends IChannelBase, IStorable {
	/**
	 * The templates of the channel
	 *
	 * @type {ITemplate[]}
	 */
	templates: ITemplate[];

	/**
	 * Denotes if the template should be considered as empty
	 *
	 * @returns {boolean}
	 */
	isEmpty(): boolean;

	/**
	 * Returns a new template instance
	 *
	 * @returns {ITemplate}
	 */
	newTemplate(): ITemplate;

	/**
	 * Push a new template
	 *
	 * @param {ITemplate} template
	 * @returns {void}
	 */
	addTemplate(template: ITemplate): void;

	/**
	 * Remove empty templates
	 *
	 * @returns {void}
	 */
	filter(): void;

	/**
	 * Convert the instance to an object
	 *
	 * @returns {IChannelBase}
	 */
	toObject(): IChannelBase;
}
