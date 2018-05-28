import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AceEditorModule} from 'ng2-ace-editor';
import {TooltipModule} from 'ngx-bootstrap';
import {TranslateModuleLoad} from '../translate-import';

// Services
import {HotkeyModule} from 'angular2-hotkeys';
import {ValidatorService} from './services/validator.service';

import {ModelModule, StorageService as ModelStorageService} from '../model/model.module';
import {ChannelModule, StorageService as ChannelStorageService} from '../channel/channel.module';

// Components
import {ValidatorEditorComponent} from './components/validator-editor/validator-editor.component';
import {ValidatorModelDetailsComponent} from './components/validator-model-details/validator-model-details.component';
import { ValidatorIconComponent } from './components/validator-icon/validator-icon.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AceEditorModule,
    TranslateModuleLoad(),
    TooltipModule.forRoot(),
    HotkeyModule,
    ModelModule,
    ChannelModule
  ],
  declarations: [
    ValidatorEditorComponent,
    ValidatorModelDetailsComponent,
    ValidatorIconComponent
  ],
  providers: [
    ModelStorageService,
    ChannelStorageService,
    ValidatorService
  ],
  exports: [
    ValidatorEditorComponent,
    ValidatorIconComponent
  ]
})
export class ValidatorModule {
}

export {IValidatorResult} from './interfaces/validator-result';
export {ValidatorService} from './services/validator.service';
