import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	@Input() mode: 'list' | 'grid' = 'list';
	addingNewModel = false;
	@Output() newModel = new EventEmitter<void>();

	constructor() {}

	ngOnInit() {}
}
