import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AlertModule, TooltipModule} from 'ngx-bootstrap';
import {AceEditorModule} from 'ng2-ace-editor';
import {TranslateModuleLoad} from '../translate-import';

import {ModelModule, StorageService as ModelStorageService} from '../model/model.module';
import {ChannelModule, StorageService as ChannelStorageService} from '../channel/channel.module';

// Components
import {SimpleComponent} from './components/simple/simple.component';

// Services
import {GeneratorService} from './services/generator.service';
import {DotGeneratorService} from './services/dot-generator.service';
import {JavaScriptGeneratorService} from './services/js-generator.service';
import {HpfGeneratorService} from './services/hpf-generator.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AceEditorModule,
    TranslateModuleLoad(),
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    ModelModule,
    ChannelModule
  ],
  declarations: [
    SimpleComponent
  ],
  providers: [
    ModelStorageService,
    ChannelStorageService,
    GeneratorService,
    DotGeneratorService,
    JavaScriptGeneratorService,
    HpfGeneratorService
  ],
})
export class GeneratorModule {
}

export {GENERATOR_ROUTES} from './generator.routing';
export {GeneratorService} from './services/generator.service';
