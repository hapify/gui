import { Component, Input } from '@angular/core';
import { IModel } from '../../interfaces/model';

@Component({
	selector: 'app-model-model-light',
	templateUrl: './model-light.component.html',
	styleUrls: ['../model/model.component.scss']
})
export class ModelLightComponent {
	/** Constructor */
	constructor() {}

	/** @type {IModel} Model instance */
	@Input() model: IModel;
	/** @type {IModel[]} Available Models */
	@Input() models: IModel[];
}