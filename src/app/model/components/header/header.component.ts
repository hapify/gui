import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { IModel } from '@app/model/interfaces/model';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	addingNewModel = false;
	@Output() newModel = new EventEmitter<IModel>();
	@Input() newModelDisabled = false;

	constructor() {}

	ngOnInit() {}
}
