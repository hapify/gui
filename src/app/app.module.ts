import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app.routing';
import {AlertModule, TooltipModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {TranslateModuleLoad} from './translate-import';
import {AceEditorModule} from 'ng2-ace-editor';
import {ValidatorService} from './validator/services/validator.service';

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
import {ChannelModule} from './channel/channel.module';
import {ModelModule} from './model/model.module';
import {GeneratorModule} from './generator/generator.module';
import {DeployerModule} from './deployer/deployer.module';
import {LoaderModule} from './loader/loader.module';
import {WebSocketService} from './services/websocket.service';

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
    AceEditorModule,
    FormsModule,
    HotkeyModule.forRoot(),
    ChannelModule,
    ModelModule,
    GeneratorModule,
    DeployerModule,
    LoaderModule
  ],
  providers: [
    ConfigService,
    StringService,
    AceService,
    ValidatorService,
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
