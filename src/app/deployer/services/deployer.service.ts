import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ConfigService} from '../../services/config.service';
import {IDeployerSession} from '../interfaces/deployer-session';
import {Observable} from 'rxjs/Observable';
import {IDeployerMessage, DeployerMessages, DeployerOrders} from '../interfaces/deployer-message';
import {IDeployerRequest} from '../interfaces/deployer-request';
import {Subject} from 'rxjs/Subject';
import {StorageService as ModelStorageService} from '../../model/model.module';
import {StorageService as ChannelStorageService} from '../../channel/channel.module';
import {GeneratorService} from '../../generator/services/generator.service';

@Injectable()
export class DeployerService {

  /**
   * @type {WebSocket} The current websocket
   */
  private ws: WebSocket;

  /**
   * Current request
   *
   * @type {IDeployerRequest}
   */
  private request: IDeployerRequest;

  /**
   * Incoming messages/orders from server
   *
   * @private
   */
  private _messageSubject = new Subject<IDeployerMessage>();
  private _messageObservable: Observable<IDeployerMessage> = this._messageSubject.asObservable();

  /**
   * Constructor
   *
   * @param {ConfigService} configService
   * @param {HttpClient} http
   * @param {ModelStorageService} modelStorageService
   * @param {ChannelStorageService} channelStorageService
   * @param {} generatorService
   */
  constructor(private configService: ConfigService,
              private http: HttpClient,
              private modelStorageService: ModelStorageService,
              private channelStorageService: ChannelStorageService,
              private generatorService: GeneratorService) {
    // Respond to server orders
    this._messageObservable.subscribe(async (message: IDeployerMessage) => {
      // Next file order
      if (message.id === DeployerOrders.NEXT_CHANNEL) {
        try {
          // Get the required channel
          const requiredChannel = message.data.channel;
          const channel = await this.channelStorageService.find(requiredChannel);
          // If no channel, break the process
          if (!channel) {
            return await this.internalError('Channel not found');
          }
          // Get all the models
          const models = await this.modelStorageService.list();
          // If no models, break the process
          if (!models) {
            return await this.internalError('No model found');
          }
          // Generate the content
          const b64 = await this.generatorService.zip(models, channel, 'base64');

          await this.send(DeployerMessages.CHANNEL, {
            name: this.request.name,
            channel: requiredChannel,
            content: b64
          });

        } catch (error) {
          this.internalError(error.toString());
        }
      }
    });
  }

  /**
   * Start the deployment process
   *
   * @param {IDeployerRequest} request
   * @return {Promise<void|Error>}
   */
  async run(request: IDeployerRequest) {
    // Set the request
    this.request = request;
    // Connect to the server
    await this.handshake();
    // Force send the request
    await this.send(DeployerMessages.REQUEST, this.request);
  }

  /**
   * If the websocket connection in not running,
   * get a new JWT token and open a new connection
   *
   * @return {Promise<void>}
   */
  private handshake() {
    return new Promise((resolve, reject) => {
      // Leave early
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }
      // Get JWT
      const sessionUrl = this.configService.getDeployerSessionUrl();
      let sessionHeaders = new HttpHeaders();
      sessionHeaders = sessionHeaders.append('X-Hapify-Id', this.configService.getDeployerSessionId());
      sessionHeaders = sessionHeaders.append('X-Hapify-Key', this.configService.getDeployerSessionKey());
      // Start the handshake
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
          this.ws.onclose = (event: CloseEvent) => {

          };
          this.ws.onerror = (event: ErrorEvent) => {
            console.error(event);
          };
          this.ws.onopen = (event: Event) => {
            resolve();
          };
        })
        .catch((error: HttpErrorResponse) => {
          console.error(error);
          reject(error);
        });
    });
  }

  /**
   * Get the observable for messages
   *
   * @return {Observable<IDeployerMessage>}
   */
  messages(): Observable<IDeployerMessage> {
    return this._messageObservable;
  }

  /**
   * Send a message to the server
   *
   * @param {string} id
   * @param {{}} data
   * @return {Promise<void>}
   */
  private async send(id: string, data = {}) {
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
    const message: IDeployerMessage = {
      id: 'internalError',
      type: 'error',
      date: new Date(),
      data: {error},
    };
    this._messageSubject.next(message);
    // Cancel the current deployment
    await this.send(DeployerMessages.CANCEL, {name: this.request.name});
  }
}
