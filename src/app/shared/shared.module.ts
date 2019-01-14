import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatInputModule,
	MatFormFieldModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatCardModule,
	MatIconModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatSelectModule,
	MatTooltipModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
	declarations: [],
	imports: [CommonModule, DragDropModule, BrowserAnimationsModule],
	exports: [
		MatInputModule,
		MatFormFieldModule,
		MatIconModule,
		MatButtonModule,
		MatCardModule,
		MatSelectModule,
		MatTooltipModule,
		MatMenuModule,
		MatButtonToggleModule,
		DragDropModule,
		MatProgressSpinnerModule
	]
})
export class SharedModule {}
