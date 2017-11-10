import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app.routing';
import {AlertModule, TooltipModule} from 'ngx-bootstrap';

// Translation
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// Components
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/common/header/header.component';
import {ModelComponent} from './components/model/model.component';

// Services
import {ConfigService} from './services/config.service';
import {StorageService} from './services/storage.service';
import {StringService} from './services/string.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ModelComponent
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
    AlertModule.forRoot()
  ],
  providers: [
    ConfigService,
    StorageService,
    StringService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
