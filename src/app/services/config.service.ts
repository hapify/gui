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
}
