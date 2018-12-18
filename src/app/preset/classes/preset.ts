import { IPreset, IPresetBase } from '../interfaces/preset';
import { Model, IModel, IModelBase } from '../../model/model.module';

export class Preset implements IPreset {
	/**
	 * Constructor
	 * Auto-generate unique id
	 */
	constructor() {}

	/**
	 * @inheritDoc
	 */
	public id = '';
	/**
	 * @inheritDoc
	 */
	public icon = '';
	/**
	 * @inheritDoc
	 */
	public name = '';
	/**
	 * @inheritDoc
	 */
	public models: IModel[] = [];

	/**
	 * @inheritDoc
	 */
	public newModel(): IModel {
		return new Model();
	}

	/**
	 * @inheritDoc
	 */
	public fromObject(object: IPresetBase): void {
		this.id = object.id;
		this.icon = object.icon;
		this.name = object.name;
		this.models = object.models.map(
			(modelBase: IModelBase): IModel => {
				const model = this.newModel();
				model.fromObject(modelBase);
				return model;
			}
		);
	}

	/**
	 * @inheritDoc
	 */
	public toObject(): IPresetBase {
		return {
			id: this.id,
			icon: this.icon,
			name: this.name,
			models: this.models.map(
				(model: IModel): IModelBase => model.toObject()
			)
		};
	}
}
