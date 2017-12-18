import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AlertModule, TooltipModule} from 'ngx-bootstrap';
import {ModelModule, StorageService as ModelStorageService} from '../model/model.module';
import {ChannelModule, StorageService as ChannelStorageService} from '../channel/channel.module';

// Components
import {SimpleComponent} from './components/simple/simple.component';

// Services
import {GeneratorService} from './services/generator.service';
import {DotGeneratorService} from './services/dot-generator.service';
import {JavaScriptGeneratorService} from './services/js-generator.service';

// Translation
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

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
    JavaScriptGeneratorService
  ],
})
export class GeneratorModule {
}
export {GENERATOR_ROUTES} from './generator.routing';
export {GeneratorService} from './services/generator.service';
