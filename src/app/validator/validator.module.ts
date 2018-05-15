import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AceEditorModule} from 'ng2-ace-editor';
import {TooltipModule} from 'ngx-bootstrap';
import {TranslateModuleLoad} from '../translate-import';

// Services
import {HotkeyModule} from 'angular2-hotkeys';
import {ValidatorService} from './services/validator.service';

// Components
import {ValidatorEditorComponent} from './components/validator-editor/validator-editor.component';
import {ValidatorModelDetailsComponent} from './components/validator-model-details/validator-model-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AceEditorModule,
    TranslateModuleLoad(),
    TooltipModule.forRoot(),
    HotkeyModule
  ],
  declarations: [
    ValidatorEditorComponent,
    ValidatorModelDetailsComponent
  ],
  providers: [
    ValidatorService
  ],
  exports: [
    ValidatorEditorComponent
  ]
})
export class ValidatorModule {
}

export {IValidatorResult} from './interfaces/validator-result';
export {ValidatorService} from './services/validator.service';
