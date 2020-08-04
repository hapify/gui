import { Component, OnInit, Input } from '@angular/core';
import { IChannel } from '../../interfaces/channel';

@Component({
	selector: 'app-channel-channel-card',
	templateUrl: './channel-card.component.html',
	styleUrls: ['./channel-card.component.scss'],
})
export class ChannelCardComponent implements OnInit {
	/** Constructor */
	constructor() {}
	/** @type {IChannel} Channel instance */
	@Input() channel: IChannel;

	/**
	 * @inheritDoc
	 */
	ngOnInit() {}
}
