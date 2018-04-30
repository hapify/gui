import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app.routing';
import {AlertModule, TooltipModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {TranslateModuleLoad} from './translate-import';

// Components
import {AppComponent} from './app.component';
import {ModelComponent} from './components/model/model.component';
import {ChannelComponent} from './components/channel/channel.component';
import {GeneratorComponent} from './components/generator/generator.component';
import {LoaderComponent} from './components/loader/loader.component';
import {DeployerComponent} from './components/deployer/deployer.component';
import {SidebarComponent} from './components/common/sidebar/sidebar.component';

// Services
import {ConfigService} from './services/config.service';
import {StringService} from './services/string.service';
import {AceService} from './services/ace.service';
import {HeaderComponent} from './components/common/header/header.component';
import {HotkeyModule} from 'angular2-hotkeys';


@NgModule({
  declarations: [
    AppComponent,
    ModelComponent,
    ChannelComponent,
    GeneratorComponent,
    LoaderComponent,
    DeployerComponent,
    SidebarComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModuleLoad(),
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    FormsModule,
    HotkeyModule.forRoot()
  ],
  providers: [
    ConfigService,
    StringService,
    AceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
