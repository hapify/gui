import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

type MessageLevel = 'info' | 'success' | 'warning' | 'error';

@Injectable()
export class MessageService {
	/** Display duration*/
	duration = 5000;

	/** Constructor */
	constructor(
		private translateService: TranslateService,
		public snackBar: MatSnackBar
	) {
		// setTimeout(() => {
		//   this.error(new Error('Fuck that shit'));
		// }, 1000);
	}
	/** Show info */
	info(message: string): void {
		this._show(message, 'info');
	}
	/** Show success */
	success(message: string): void {
		this._show(message, 'success');
	}
	/** Show warning */
	warning(message: string): void {
		this._show(message, 'warning');
	}
	/** Handle an error */
	error(error: Error, asWarning = false): void {
		const message = `${error.name}: ${error.message}`;
		this._show(message, asWarning ? 'warning' : 'error');
		this.log(error);
	}
	/** Log a message */
	log(message: any): void {
		if (message instanceof Error) {
			console.error(message);
		} else {
			console.log(message);
		}
	}

	/** Show the snackbar with the message */
	private _show(message: string, level: MessageLevel): void {
		this.translateService
			.get('error_dismiss-action')
			.subscribe(dismissText => {
				this.snackBar.open(message, dismissText, {
					duration: this.duration,
					panelClass: ['messageBar', `${level}Bar`],
					horizontalPosition: 'right',
					verticalPosition: 'top'
				});
			});
	}
}
