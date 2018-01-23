import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app.routing';
import {AlertModule, TooltipModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';

// Translation
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// Components
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/common/header/header.component';
import {ModelComponent} from './components/model/model.component';
import {ChannelComponent} from './components/channel/channel.component';
import {GeneratorComponent} from './components/generator/generator.component';

// Services
import {ConfigService} from './services/config.service';
import {StringService} from './services/string.service';
import {DemoService} from './services/demo.service';
import {AceService} from './services/ace.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ModelComponent,
    ChannelComponent,
    GeneratorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    FormsModule
  ],
  providers: [
    ConfigService,
    StringService,
    DemoService,
    AceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
