import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

enum MessageLevel {
	INFO,
	SUCCESS,
	WARNING,
	ERROR
}

@Injectable()
export class MessageService {
	/** Display duration*/
	duration = 5000;
	/** Text to display for dismiss message */
	dismissText: string;

	/** Constructor */
	constructor(
		private translateService: TranslateService,
		public snackBar: MatSnackBar
	) {
		this.translateService.get('error_dismiss-action').subscribe(text => {
			this.dismissText = text;
		});
		// this.error(new Error('Fuck that shit'));
	}
	/** Show info */
	info(message: string): void {
		this._show(message, MessageLevel.INFO);
	}
	/** Show success */
	success(message: string): void {
		this._show(message, MessageLevel.SUCCESS);
	}
	/** Show warning */
	warning(message: string): void {
		this._show(message, MessageLevel.WARNING);
	}
	/** Handle an error */
	error(error: Error, asWarning = false): void {
		const message = `${error.name}: ${error.message}`;
		this._show(
			message,
			asWarning ? MessageLevel.WARNING : MessageLevel.ERROR
		);
	}

	/** Show the snackbar with the message */
	private _show(message: string, level: MessageLevel): void {
		this.snackBar.open(message, this.dismissText, {
			duration: this.duration,
			horizontalPosition: 'right',
			verticalPosition: 'top'
		});
	}
}
