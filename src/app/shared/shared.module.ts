import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatButtonModule,
	MatCardModule,
	MatIconModule,
	MatSelectModule
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
		ClickOutsideModule
	]
})
export class SharedModule {}
