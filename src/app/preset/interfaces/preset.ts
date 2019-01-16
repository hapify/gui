import { IModel, IModelBase } from '../../model/model.module';
import { IStorableBase, IStorable } from '../../interfaces/storable';

export interface IPresetBase extends IStorableBase {
	/** @type {string} The preset icon */
	icon: string;
	/** @type {string} The preset's name */
	name: string;
	/** @type {string} The preset's name in french */
	name__fr: string;
	/** @type {string} The preset's name */
	description: string;
	/** @type {string} The preset's name in french */
	description__fr: string;
	/** @type {IModelBase[]} The models of the preset */
	models: IModelBase[];
}

export interface IPreset extends IPresetBase, IStorable {
	/** @type {IModel[]} The models of the preset */
	models: IModel[];

	/** @returns {IPresetBase} Convert the instance to an object */
	toObject(): IPresetBase;
}
