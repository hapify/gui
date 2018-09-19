import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {IWebSocketInfo} from '../interfaces/websocket-info';
import {IWebSocketMessage} from '../interfaces/websocket-message';
import {ConfigService} from './config.service';

@Injectable()
export class WebSocketService {

  /** @type {WebSocket} The current websocket */
  private ws: WebSocket;
  /** Incoming messages/orders from server */
  private _messageSubject = new Subject<IWebSocketMessage>();
  private _messageObservable: Observable<IWebSocketMessage> = this._messageSubject.asObservable();

  /**
   * Constructor
   *
   * @param {ConfigService} configService
   */
  constructor(private configService: ConfigService) {
  }

  /**
   * If the websocket connection in not running,
   * get a new JWT token and open a new connection
   *
   * @return {Promise<void>}
   */
  async handshake() {
    // Leave early
    if (this.opened()) {
      return;
    }
    // Get JWT & url
    const wsInfo = await this.wsInfo();

    this.ws = new WebSocket(wsInfo.url);
    // Bind events
    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const decoded = <IWebSocketMessage>JSON.parse(event.data);
        this._messageSubject.next(decoded);
      } catch (error) {
        console.error(error);
      }
    };
    this.ws.onclose = (event: CloseEvent) => {

    };
    this.ws.onerror = (event: ErrorEvent) => {
      console.error(event);
    };
    // Wait for opening
    await new Promise((resolve) => {
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
    return this._messageObservable;
  }

  /**
   * Send a message to the server
   *
   * @param {string} id
   * @param {{}} data
   * @return {Promise<void>}
   */
  async push(id: string, data = {}) {
    await this.waitOpened();
    this.ws.send(JSON.stringify({id, data}));
  }

  /**
   * Send a message to the server and wait for a response
   *
   * @param {string} id
   * @param {{}} data
   * @param {number} timeout
   * @return {Promise<void>}
   */
  async pull(id: string, data = {}, timeout = 60000): Promise<any> {
    await this.waitOpened();
    return await new Promise((resolve, reject) => {
      // Declare subs
      let subscription: Subscription;
      let timeoutSub: number;
      // Create message
      const message: IWebSocketMessage = {
        id,
        data,
        tag: this.makeTag()
      };
      // Create listener
      subscription = this._messageObservable.subscribe((response: IWebSocketMessage) => {
        // Wait for the same response
        if (response.tag !== message.tag) {
          return;
        }
        // Auto remove
        subscription.unsubscribe();
        clearTimeout(timeoutSub);
        // On error
        if (response.type === 'error') {
          reject(new Error(`Error from WebSocket server: ${response.data ? response.data.error : 'No data'}`));
          return;
        }
        // On success
        resolve(response.data);
      });
      // Set timeout
      timeoutSub = setTimeout(() => {
        subscription.unsubscribe();
        reject(new Error('No response from WebSocket server'));
      }, timeout);
      // Start request
      this.ws.send(JSON.stringify(message));
    });
  }

  /**
   * Push an error
   *
   * @param {string} error
   * @return {Promise<void>}
   */
  private async internalError(error) {
    // Build message to propagate
    const message: IWebSocketMessage = {
      id: 'internalError',
      type: 'error',
      data: {error},
    };
    this._messageSubject.next(message);
    console.error(error);
  }

  /**
   * Get the info to connect to the websocket
   *
   * @return {IWebSocketInfo}
   */
  private async wsInfo(): Promise<IWebSocketInfo> {
    try {
      const response = await fetch(this.configService.getWebSocketInfoUrl(), { cache: 'no-store' });
      return <IWebSocketInfo>(await response.json());
    } catch (error) {
      this.internalError(error.toString());
    }
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
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
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
    await new Promise((resolve => {
      setTimeout(() => resolve(this.waitOpened()), 500);
    }));
  }

}
