import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AlertModule, TooltipModule} from 'ngx-bootstrap';
import {TranslateModuleLoad} from '../translate-import';

import {ModelComponent} from './components/model/model.component';
import {ModelRowComponent} from './components/model-row/model-row.component';
import {FieldComponent} from './components/field/field.component';
import {NewComponent} from './components/new/new.component';
import {RootComponent} from './components/root/root.component';
import {EditComponent} from './components/edit/edit.component';

// Services
import {StorageService} from './services/storage.service';
import {ModelsService} from '../loader/services/models.service';

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
    EditComponent,
    ModelRowComponent
  ],
  providers: [
    StorageService,
    ModelsService
  ],
})
export class ModelModule {
}
export {MODEL_ROUTES} from './model.routing';
export {Model} from './classes/model';
export {Field} from './classes/field';
export {IModel, IModelBase} from './interfaces/model';
export {IField, IFieldBase} from './interfaces/field';
export {StorageService} from './services/storage.service';
