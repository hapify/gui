import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

type MessageLevel = 'info' | 'success' | 'warning' | 'error';

export interface ErrorHandler {
	name: string;
	/** Must return true if hte error has been handled */
	handle: (error: Error) => boolean;
}

@Injectable()
export class MessageService {
	/** A set of functions that can handle an error and skip the default behavior */
	private errorHandlers: ErrorHandler[] = [];
	/** Display duration */
	defaultDuration = 4000;
	/** Display duration for error */
	errorDuration = 8000;

	/** Constructor */
	constructor(
		private translateService: TranslateService,
		public snackBar: MatSnackBar
	) {}
	/** Push an error handler to the set */
	addErrorHandler(handler: ErrorHandler) {
		// Avoid conflict
		this.removeErrorHandler(handler.name);
		this.errorHandlers.push(handler);
	}
	/** Remove an error handler to the set */
	removeErrorHandler(name: string) {
		this.errorHandlers = this.errorHandlers.filter(h => h.name !== name);
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
		// Try handlers first
		for (const handler of this.errorHandlers) {
			if (handler.handle(error)) {
				return;
			}
		}
		this._show(error.message, asWarning ? 'warning' : 'error');
		this.log(error);
	}
	/** Log a message */
	log(message: Error | string | any): void {
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
					duration:
						level === 'error'
							? this.errorDuration
							: this.defaultDuration,
					panelClass: ['messageBar', `${level}Bar`],
					horizontalPosition: 'right',
					verticalPosition: 'top'
				});
			});
	}
}
