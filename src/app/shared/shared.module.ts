import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatButtonModule,
	MatCardModule,
	MatIconModule
} from '@angular/material';

@NgModule({
	declarations: [],
	imports: [CommonModule],
	exports: [MatIconModule, MatButtonModule, MatCardModule]
})
export class SharedModule {}
