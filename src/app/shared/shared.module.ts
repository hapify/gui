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
	MatTooltipModule,
	MatSnackBarModule,
	MatTreeModule,
	MatCheckboxModule,
	MatDialogModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateEntryPipe } from '@app/pipes/translate-entry.pipe';

@NgModule({
	declarations: [TranslateEntryPipe],
	imports: [CommonModule, DragDropModule, BrowserAnimationsModule],
	exports: [
		MatInputModule,
		MatFormFieldModule,
		MatIconModule,
		MatButtonModule,
		MatCardModule,
		MatSelectModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatMenuModule,
		MatButtonToggleModule,
		DragDropModule,
		MatProgressSpinnerModule,
		TranslateEntryPipe,
		MatTreeModule,
		MatCheckboxModule,
		MatDialogModule
	]
})
export class SharedModule {}
