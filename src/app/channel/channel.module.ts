import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AlertModule, TooltipModule} from 'ngx-bootstrap';

import {ChannelComponent} from './components/channel/channel.component';
import {ChannelRowComponent} from './components/channel-row/channel-row.component';
import {TemplateComponent} from './components/template/template.component';
import {NewComponent} from './components/new/new.component';
import {RootComponent} from './components/root/root.component';

// Translation
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {EditComponent} from './components/edit/edit.component';

// Services
import {StorageService} from './services/storage.service';
import { EditorComponent } from './components/editor/editor.component';

// Directives
import {ContentEditableModelDirective} from './directives/content-editable-model.directive';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
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
