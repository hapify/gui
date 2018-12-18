import { IModel, IModelBase } from '../../model/model.module';
import { IStorableBase, IStorable } from '../../interfaces/storable';

export interface IPresetBase extends IStorableBase {
	/**
	 * The preset's icon
	 *
	 * @type {string}
	 */
	icon: string;
	/**
	 * The preset's name
	 *
	 * @type {string}
	 */
	name: string;
	/**
	 * The models of the preset
	 *
	 * @type {IModelBase[]}
	 */
	models: IModelBase[];
}

export interface IPreset extends IPresetBase, IStorable {
	/**
	 * The models of the preset
	 *
	 * @type {IModel[]}
	 */
	models: IModel[];

	/**
	 * Convert the instance to an object
	 *
	 * @returns {IPresetBase}
	 */
	toObject(): IPresetBase;
}
