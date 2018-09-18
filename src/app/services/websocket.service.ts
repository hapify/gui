import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {IWebsocketInfo} from '../interfaces/websocket-info';
import {IWebsocketMessage, WebsocketMessages} from '../interfaces/websocket-message';

@Injectable()
export class WebsocketService {

  /** @type {string} The auth token url */
  private infoUrl = 'http://localhost:4800/token.json';
  /** @type {WebSocket} The current websocket */
  private ws: WebSocket;
  /** Incoming messages/orders from server */
  private _messageSubject = new Subject<IWebsocketMessage>();
  private _messageObservable: Observable<IWebsocketMessage> = this._messageSubject.asObservable();

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * If the websocket connection in not running,
   * get a new JWT token and open a new connection
   *
   * @return {Promise<void>}
   */
  async handshake() {
    // Leave early
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }
    // Get JWT & url
    const wsInfo = await this.wsInfo();

    this.ws = new WebSocket(wsInfo.url);
    // Bind events
    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const decoded = <IWebsocketMessage>JSON.parse(event.data);
        // Add received date
        decoded.date = new Date();
        this._messageSubject.next(decoded);
      } catch (error) {
        console.error(error);
      }
    };
    this.ws.onclose = (event: CloseEvent) => {};
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
   * @return {Observable<IWebsocketMessage>}
   */
  messages(): Observable<IWebsocketMessage> {
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
    this.ws.send(JSON.stringify({id, data}));
  }

  /**
   * Push an error
   *
   * @param {string} error
   * @return {Promise<void>}
   */
  private async internalError(error) {
    // Build message to propagate
    const message: IWebsocketMessage = {
      id: 'internalError',
      type: 'error',
      date: new Date(),
      data: {error},
    };
    this._messageSubject.next(message);
    console.error(error);
  }

  /**
   * Get the info to connect to the websocket
   *
   * @return {IWebsocketInfo}
   */
  private async wsInfo(): Promise<IWebsocketInfo> {
    try {
      const response = await fetch(this.infoUrl);
      return <IWebsocketInfo>(await response.json());
    } catch (error) {
      this.internalError(error.toString());
    }
  }

}
