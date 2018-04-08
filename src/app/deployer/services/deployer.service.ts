import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ConfigService} from '../../services/config.service';
import {IDeployerSession} from '../interfaces/deployer-session';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {IDeployerMessage} from '../interfaces/deployer-message';

@Injectable()
export class DeployerService {

  /**
   * @type {WebSocket} The current websocket
   */
  private ws: WebSocket;
  
  /**
   * Incoming messages/orders from server
   *
   * @private
   */
  private _messageSubject = new BehaviorSubject<IDeployerMessage|null>(null);
  private _messageObservable: Observable<IDeployerMessage|null> = this._messageSubject.asObservable();

  /**
   * Constructor
   *
   * @param {ConfigService} configService
   * @param {HttpClient} http
   */
  constructor(private configService: ConfigService,
              private http: HttpClient) {
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
    // Get JWT
    const sessionUrl = this.configService.getDeployerSessionUrl();
    let sessionHeaders = new HttpHeaders();
    sessionHeaders = sessionHeaders.append('X-Hapify-Id', this.configService.getDeployerSessionId());
    sessionHeaders = sessionHeaders.append('X-Hapify-Key', this.configService.getDeployerSessionKey());
    return this.http.post(sessionUrl, {}, {headers: sessionHeaders})
      .toPromise()
      .then((response: IDeployerSession) => {
        const token = response.token;
        this.ws = new WebSocket(this.configService.getDeployerWebsocketUrl(token));
        // Bind events
        this.ws.onmessage = (event: MessageEvent) => {
          try {
            const decoded = <IDeployerMessage>JSON.parse(event.data);
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
      })
      .catch((error: HttpErrorResponse) => {
        console.error(error);
        return error;
      });
  }

  /**
   * Get the observable for messages
   * 
   * @return {Observable<IDeployerMessage|null>}
   */
  messages(): Observable<IDeployerMessage|null> {
    return this._messageObservable;
  }
}
