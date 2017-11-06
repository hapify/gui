import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModelComponent } from './components/model/model.component';
import { FieldComponent } from './components/field/field.component';
import { NewComponent } from './components/new/new.component';
import { RootComponent } from './components/root/root.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    ModelComponent,
    FieldComponent,
    NewComponent,
    RootComponent
  ]
})
export class ModelModule { }
export { MODEL_ROUTES} from './model.routing';
