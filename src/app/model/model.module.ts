import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AlertModule, TooltipModule} from 'ngx-bootstrap';

import {ModelComponent} from './components/model/model.component';
import {FieldComponent} from './components/field/field.component';
import {NewComponent} from './components/new/new.component';
import {RootComponent} from './components/root/root.component';

// Translation
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { EditComponent } from './components/edit/edit.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    TooltipModule.forRoot(),
    AlertModule.forRoot()
  ],
  declarations: [
    ModelComponent,
    FieldComponent,
    NewComponent,
    RootComponent,
    EditComponent
  ]
})
export class ModelModule {
}
export {MODEL_ROUTES} from './model.routing';
export {Model} from './classes/model';
export {Field} from './classes/field';
export {IModel, IModelBase} from './interfaces/model';
export {IField, IFieldBase} from './interfaces/field';
