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
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
	declarations: [],
	imports: [CommonModule, DragDropModule, BrowserAnimationsModule],
	exports: [
		MatIconModule,
		MatButtonModule,
		MatCardModule,
		MatSelectModule,
		MatTooltipModule,
		MatMenuModule,
		MatButtonToggleModule,
		DragDropModule,
		ClickOutsideModule
	]
})
export class SharedModule {}
