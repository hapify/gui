import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertModule, TooltipModule } from 'ngx-bootstrap';
import { TranslateModuleLoad } from '../translate-import';
import { ValidatorIconComponent } from '../validator/components/validator-icon/validator-icon.component';
import { ValidatorDetailsComponent } from '../validator/components/validator-details/validator-details.component';

import { ModelComponent } from './components/model/model.component';
import { ModelRowComponent } from './components/model-row/model-row.component';
import { FieldComponent } from './components/field/field.component';
import { NewComponent } from './components/new/new.component';
import { RootComponent } from './components/root/root.component';
import { View2dComponent } from './components/view2d/view2d.component';
import { EditComponent } from './components/edit/edit.component';

// Services
import { StorageService } from './services/storage.service';
import { ModelUmlBoxComponent } from './components/model-uml-box/model-uml-box.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,
		TranslateModuleLoad(),
		TooltipModule.forRoot(),
		AlertModule.forRoot()
	],
	declarations: [
		ModelComponent,
		FieldComponent,
		NewComponent,
		RootComponent,
		View2dComponent,
		EditComponent,
		ModelRowComponent,
		ModelUmlBoxComponent,
		ValidatorIconComponent,
		ValidatorDetailsComponent
	],
	providers: [StorageService]
})
export class ModelModule {}

export { MODEL_ROUTES } from './model.routing';
export { Model } from './classes/model';
export { Field } from './classes/field';
export { IModel, IModelBase } from './interfaces/model';
export { IField, IFieldBase } from './interfaces/field';
export { IAccesses, Access } from './interfaces/access';
export { StorageService } from './services/storage.service';
