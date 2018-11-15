import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {IWebSocketInfo} from '../interfaces/websocket-info';
import {IWebSocketMessage} from '../interfaces/websocket-message';
import {ConfigService} from './config.service';

const SECOND = 1000;
const MINUTE = 60 * SECOND;

@Injectable()
export class WebSocketService {

  /** @type {WebSocket} The current websocket */
  private ws: WebSocket;
  /** Incoming messages/orders from server */
  private messageSubject = new Subject<IWebSocketMessage>();
  private messageObservable: Observable<IWebSocketMessage> = this.messageSubject.asObservable();

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
        this.messageSubject.next(decoded);
      } catch (error) {
        this.logError(error);
      }
    };
    this.ws.onclose = (event: CloseEvent) => {
      this.logError(new Error(`Connection lost: ${event.reason}`));
    };
    this.ws.onerror = (event: ErrorEvent) => {
      this.logError(new Error(event.message));
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
    return this.messageObservable;
  }

  /**
   * Send a message to the server and wait for a response
   *
   * @param {string} id
   * @param {{}} data
   * @param {number} timeout
   * @return {Promise<void>}
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
      subscription = this.messageObservable.subscribe((response: IWebSocketMessage) => {
        // Wait for the same response
        if (response.tag !== message.tag) {
          return;
        }
        // Auto remove
        subscription.unsubscribe();
        clearTimeout(timeoutSub);
        // On error
        if (response.type === 'error') {
          const error = new Error(`Error from WebSocket server: ${response.data ? response.data.error : 'No data'}`);
          this.logError(error);
          reject(error);
          return;
        }
        // On success
        resolve(response.data);
      });
      // Set timeout
      timeoutSub = setTimeout(() => {
        subscription.unsubscribe();
        const error = new Error('No response from WebSocket server');
        this.logError(error);
        reject(error);
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
    this.messageSubject.next(message);
    this.logError(error);
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

  /** Log an error */
  private logError(error: Error) {
    console.error(event);
  }

}
