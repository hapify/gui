import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertModule, TooltipModule } from 'ngx-bootstrap';
import { TranslateModuleLoad } from '../translate-import';

import { RootComponent } from './components/root/root.component';
import { PresetCardComponent } from './components/preset-card/preset-card.component';

// Services
import { StorageService } from './services/storage.service';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,
		TranslateModuleLoad(),
		TooltipModule.forRoot(),
		AlertModule.forRoot(),
		SharedModule
	],
	declarations: [RootComponent, PresetCardComponent],
	providers: [StorageService]
})
export class PresetModule {}

export { PRESET_ROUTES } from './preset.routing';
export { Preset } from './classes/preset';
export { IPreset, IPresetBase } from './interfaces/preset';
export { StorageService } from './services/storage.service';
