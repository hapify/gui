import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing';
import { AlertModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { TranslateModuleLoad } from './translate-import';
import { AceEditorModule } from 'ng2-ace-editor';
import { ValidatorService } from './validator/services/validator.service';

// Components
import { AppComponent } from './app.component';
import { ModelComponent } from './components/model/model.component';
import { PresetComponent } from './components/preset/preset.component';
import { ChannelComponent } from './components/channel/channel.component';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { DocumentationComponent } from '@app/components/documentation/documentation.component';

// Services
import { ConfigService } from './services/config.service';
import { StringService } from './services/string.service';
import { AceService } from './services/ace.service';
import { HeaderComponent } from './components/common/header/header.component';
import { HotkeyModule } from 'angular2-hotkeys';
import { ChannelModule } from './channel/channel.module';
import { ModelModule } from './model/model.module';
import { PresetModule } from './preset/preset.module';
import { WebSocketService } from './services/websocket.service';
import { SharedModule } from '@app/shared/shared.module';
import {
	PERFECT_SCROLLBAR_CONFIG,
	PerfectScrollbarModule,
	PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';
import { MessageService } from '@app/services/message.service';
import { InfoService } from '@app/services/info.service';
import { DocumentationModule } from '@app/documentation/documentation.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	suppressScrollX: true
};

@NgModule({
	declarations: [
		AppComponent,
		ModelComponent,
		/*PresetComponent,*/
		ChannelComponent,
		SidebarComponent,
		HeaderComponent,
		DocumentationComponent
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
		/*PresetModule,*/
		SharedModule,
		DocumentationModule,
		PerfectScrollbarModule
	],
	providers: [
		ConfigService,
		StringService,
		AceService,
		ValidatorService,
		WebSocketService,
		MessageService,
		InfoService,
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
