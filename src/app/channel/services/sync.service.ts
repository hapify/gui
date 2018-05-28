import {Injectable, Injector} from '@angular/core';
import {ConfigService} from '../../services/config.service';
import {ITemplate} from '../interfaces/template';
import {GeneratorService} from '../../generator/services/generator.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class SyncService {

  /** @type {boolean} Used to keep activation across multiple editors */
  public autoSyncEnabled = false;
  /** @type {GeneratorService} Injected in the constructor */
  private generatorService: GeneratorService;

  /**
   * Constructor
   *
   * @param {ConfigService} configService
   * @param {HttpClient} http
   * @param {Injector} injector
   */
  constructor(private configService: ConfigService,
              private http: HttpClient,
              private injector: Injector) {
    this.generatorService = this.injector.get(GeneratorService);
  }

  /**
   * Sync template
   *
   * @param {ITemplate} template
   */
  async run(template: ITemplate) {
    // If not available, leave
    if (!this.enabled()) {
      return;
    }
    // Build paylaod
    const files = await this.generatorService.compile(template);
    const payload = {
      channel: template.channel().id,
      files
    };
    // Send the files
    await this.http.post(this.configService.getSyncUrl(), payload, {headers: this._getRequestHeaders()})
      .toPromise();
  }

  /**
   * Returns the commons headers for a request
   *
   * @param {HttpHeaders} headers
   * @returns {HttpHeaders}
   * @private
   */
  private _getRequestHeaders(headers: HttpHeaders = new HttpHeaders()): HttpHeaders {
    headers = headers.append('X-Hapify-Token', this.configService.getSyncToken());
    return headers;
  }

  /**
   * Denotes if the Sync server is available
   *
   * @returns {boolean}
   */
  enabled(): boolean {
    return !!this.configService.getSyncUrl();
  }
}
