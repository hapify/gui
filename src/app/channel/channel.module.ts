import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AlertModule, TooltipModule} from 'ngx-bootstrap';
import {AceEditorModule} from 'ng2-ace-editor';
import {TranslateModuleLoad} from '../translate-import';

import {ChannelComponent} from './components/channel/channel.component';
import {ChannelRowComponent} from './components/channel-row/channel-row.component';
import {TemplateComponent} from './components/template/template.component';
import {NewComponent} from './components/new/new.component';
import {RootComponent} from './components/root/root.component';
import {EditComponent} from './components/edit/edit.component';


// Services
import {StorageService} from './services/storage.service';
import { EditorComponent } from './components/editor/editor.component';

// Directives
import {ContentEditableModelDirective} from './directives/content-editable-model.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AceEditorModule,
    TranslateModuleLoad(),
    TooltipModule.forRoot(),
    AlertModule.forRoot()
  ],
  declarations: [
    ChannelComponent,
    TemplateComponent,
    NewComponent,
    RootComponent,
    EditComponent,
    ChannelRowComponent,
    EditorComponent,
    ContentEditableModelDirective
  ],
  providers: [
    StorageService
  ],
})
export class ChannelModule {
}
export {CHANNEL_ROUTES} from './channel.routing';
export {Channel} from './classes/channel';
export {Template} from './classes/template';
export {IChannel, IChannelBase} from './interfaces/channel';
export {ITemplate, ITemplateBase} from './interfaces/template';
export {TemplateEngine} from './interfaces/template-engine.enum';
export {StorageService} from './services/storage.service';
