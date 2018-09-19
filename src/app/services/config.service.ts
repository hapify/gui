import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class ConfigService {

  constructor() {
  }

  /**
   * Get the base path for ace
   *
   * @return {string}
   */
  getAceBaseUri(): string {
    return environment.ace.baseUri;
  }

  /**
   * Get the theme for ace
   *
   * @return {string}
   */
  getAceTheme(): string {
    return environment.ace.theme;
  }

  /**
   * Get the bitbucket api base uri
   *
   * @return {string}
   */
  getBitbucketBaseUri(): string {
    return environment.bitbucket.baseUri;
  }

  /**
   * Get the bitbucket client id
   *
   * @return {string}
   */
  getBitbucketAuthorizeUrl(): string {
    return environment.bitbucket.authorize;
  }

  /**
   * Get the bitbucket download proxy url
   *
   * @return {string}
   */
  getBitbucketProxyUrl(): string {
    return environment.bitbucket.proxyUrl;
  }

  /**
   * Get the bitbucket download proxy uri
   *
   * @return {string}
   */
  getBitbucketProxyToken(): string {
    return environment.bitbucket.proxyToken;
  }

  /**
   * Get the deployer session url
   *
   * @return {string}
   */
  getDeployerSessionUrl(): string {
    return `${environment.deployer.apiUrl}/session`;
  }

  /**
   * Get the deployer machines' endpoints url
   *
   * @return {string}
   */
  getDeployerMachinesUrl(): string {
    return `${environment.deployer.apiUrl}/machine`;
  }

  /**
   * Get the deployer session id
   *
   * @return {string}
   */
  getDeployerSessionId(): string {
    return environment.deployer.session.id;
  }

  /**
   * Get the deployer session key
   *
   * @return {string}
   */
  getDeployerSessionKey(): string {
    return environment.deployer.session.key;
  }

  /**
   * Build and returns the deployer websocket url
   *
   * @param {string} token
   * @return {string}
   */
  getDeployerWebsocketUrl(token): string {
    return `${environment.deployer.wsUrl}?token=${encodeURIComponent(token)}`;
  }

  /**
   * Returns the sync URL if exists
   *
   * @return {string|null}
   */
  getSyncUrl(): string {
    return typeof environment.sync === 'object' ?
      `${(<any>environment.sync).apiUrl}` : null;
  }

  /**
   * Returns the ws info url
   *
   * @return {string}
   */
  getWebSocketInfoUrl(): string {
    const uri = <string>environment.cli.wsInfoUri;
    return uri.startsWith('http') ? uri : `${location.protocol}//${location.host}${uri}`;
  }

  /**
   * Returns the sync token if exists
   *
   * @return {string|null}
   */
  getSyncToken(): string {
    return typeof environment.sync === 'object' ?
      `${(<any>environment.sync).token}` : null;
  }
}
