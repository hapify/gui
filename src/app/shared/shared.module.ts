import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatCardModule,
	MatIconModule,
	MatMenuModule,
	MatSelectModule,
	MatTooltipModule
} from '@angular/material';
import { ClickOutsideModule } from 'ng4-click-outside';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
	declarations: [],
	imports: [CommonModule, BrowserAnimationsModule],
	exports: [
		MatIconModule,
		MatButtonModule,
		MatCardModule,
		MatSelectModule,
		MatTooltipModule,
		MatMenuModule,
		MatButtonToggleModule,
		ClickOutsideModule
	]
})
export class SharedModule {}
