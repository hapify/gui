import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { IWebSocketInfo } from '../interfaces/websocket-info';
import { IWebSocketMessage } from '../interfaces/websocket-message';
import { ConfigService } from './config.service';
import { MessageService } from './message.service';
import { RichError } from '@app/class/RichError';

const SECOND = 1000;
const MINUTE = 60 * SECOND;

@Injectable()
export class WebSocketService {
	/** @type {WebSocket} The current websocket */
	private ws: WebSocket;
	/** Incoming messages/orders from server */
	private messageSubject = new Subject<IWebSocketMessage>();
	private messageObservable: Observable<
		IWebSocketMessage
	> = this.messageSubject.asObservable();
	/** @type {boolean} Delay to retry connection */
	private reconnectDelay = 10 * SECOND;

	/** Constructor */
	constructor(
		private configService: ConfigService,
		private messageService: MessageService
	) {}

	/**
	 * If the websocket connection in not running,
	 * get a new JWT token and open a new connection
	 *
	 * @param {number} delay
	 * @return {Promise<void>}
	 */
	async handshake(delay = 0) {
		// Leave early
		if (this.opened()) {
			return;
		}
		// Wait a while before handshake
		if (delay) {
			await new Promise(r => setTimeout(r, delay));
		}
		// Get JWT & url
		let wsInfo;
		try {
			wsInfo = await this.wsInfo();
		} catch (error) {
			this.messageService.error(
				new RichError(
					`Cannot fetch connection info. Try again in ${
						this.reconnectDelay
					}ms`,
					{
						code: 5004,
						type: 'ConsoleWebSocketFetchError'
					}
				)
			);
			return await this.handshake(this.reconnectDelay);
		}

		this.ws = new WebSocket(wsInfo.url);
		// Bind events
		this.ws.onmessage = (event: MessageEvent) => {
			try {
				const decoded = <IWebSocketMessage>JSON.parse(event.data);
				this.messageSubject.next(decoded);
			} catch (error) {
				this.messageService.error(error);
			}
		};
		this.ws.onclose = (event: CloseEvent) => {
			this.messageService.error(
				new RichError(
					`WebSocket connection lost. Try again in ${
						this.reconnectDelay
					}ms`,
					{
						code: 5005,
						type: 'ConsoleWebSocketConnectionError'
					}
				)
			);
			this.handshake(this.reconnectDelay);
		};
		this.ws.onerror = (event: ErrorEvent) => {
			this.messageService.error(
				new RichError(event.message, {
					code: 5002,
					type: 'ConsoleWebSocketError'
				})
			);
		};
		// Wait for opening
		await new Promise(resolve => {
			this.ws.onopen = (event: Event) => {
				resolve();
			};
		});
	}

	/**
	 * Get the observable for messages
	 *
	 * @return {Observable<IWebSocketMessage>}
	 */
	messages(): Observable<IWebSocketMessage> {
		return this.messageObservable;
	}

	/**
	 * Send a message to the server and wait for a response
	 *
	 * @param {string} id
	 * @param {{}} data
	 * @param {number} timeout
	 * @return {Promise<any>}
	 */
	async send(id: string, data = {}, timeout = MINUTE): Promise<any> {
		await this.waitOpened();
		return await new Promise((resolve, reject) => {
			// Declare subs
			let subscription: Subscription;
			let timeoutSub: any;
			// Create message
			const message: IWebSocketMessage = {
				id,
				data,
				tag: this.makeTag()
			};
			// Create listener
			subscription = this.messageObservable.subscribe(
				(response: IWebSocketMessage) => {
					// Wait for the same response
					if (response.tag !== message.tag) {
						return;
					}
					// Auto remove
					subscription.unsubscribe();
					clearTimeout(timeoutSub);
					// On error
					if (response.type === 'error') {
						const error =
							response.data && response.data.data
								? RichError.from(response.data)
								: new RichError(
										response.data
											? response.data.message
											: 'Error from WebSocket server',
										{
											code: 5006,
											type:
												'ConsoleWebSocketResponseError'
										}
								  );
						this.messageService.error(error);
						reject(error);
						return;
					}
					// On success
					resolve(response.data);
				}
			);
			// Set timeout
			timeoutSub = setTimeout(() => {
				subscription.unsubscribe();
				const error = new RichError(
					'No response from WebSocket server',
					{
						code: 5003,
						type: 'ConsoleWebSocketTimeoutError'
					}
				);
				this.messageService.error(error);
				reject(error);
			}, timeout);
			// Start request
			this.ws.send(JSON.stringify(message));
		});
	}

	/**
	 * Get the info to connect to the websocket
	 *
	 * @return {IWebSocketInfo}
	 */
	private async wsInfo(): Promise<IWebSocketInfo> {
		const response = await fetch(this.configService.getWebSocketInfoUrl(), {
			cache: 'no-store'
		});
		return <IWebSocketInfo>await response.json();
	}

	/**
	 * Denotes if the server is connected
	 * @return {boolean}
	 */
	opened(): boolean {
		return this.ws && this.ws.readyState === WebSocket.OPEN;
	}

	/**
	 * Create a unique id
	 * @return {string}
	 */
	private makeTag(): string {
		let text = '';
		const possible =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < 16; i++) {
			text += possible.charAt(
				Math.floor(Math.random() * possible.length)
			);
		}
		return text;
	}

	/**
	 * Resolves when the client is ready
	 * @return {Promise<any>}
	 */
	private async waitOpened() {
		if (this.opened()) {
			return;
		}
		await new Promise(resolve => {
			setTimeout(() => resolve(this.waitOpened()), 500);
		});
	}
}
