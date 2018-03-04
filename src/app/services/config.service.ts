import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class ConfigService {

  constructor() {
  }

  /**
   * Get the demo base path
   *
   * @return {string}
   */
  getDemoBaseUri(): string {
    return environment.demo.baseUri;
  }

  /**
   * Get the name of the manifest file (relative to demo.baseUri)
   *
   * @return {string}
   */
  getDemoManifest(): string {
    return environment.demo.manifest;
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
}
