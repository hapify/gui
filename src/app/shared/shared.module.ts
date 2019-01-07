import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatButtonModule,
	MatCardModule,
	MatIconModule
} from '@angular/material';
import { ClickOutsideModule } from 'ng4-click-outside';

@NgModule({
	declarations: [],
	imports: [CommonModule, ClickOutsideModule],
	exports: [MatIconModule, MatButtonModule, MatCardModule, ClickOutsideModule]
})
export class SharedModule {}
