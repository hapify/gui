import { Injectable } from '@angular/core';
import {ConfigService} from '../../services/config.service';

@Injectable()
export class BitbucketService {

  /**
   * @type {string}
   */
  private _tokenKey = 'bitbucket-token';

  /**
   * The storage used to keep data
   *
   * @type {Storage}
   * @private
   */
  private _storage: Storage = localStorage;

  /**
   * Constructor
   */
  constructor(private configService: ConfigService) {
  }

  /**
   * User is already connected to Bitbucket
   *
   * @returns {boolean}
   */
  isConnected(): boolean {

    return !!this.getToken();
  }

  /**
   * Perform the OAuth2 connexion
   */
  connect() {
    window.location.href = this.configService.getBitbucketAuthorizeUrl();
  }

  /**
   * Perform the OAuth2 connexion
   */
  disconnect() {
    this._storage.removeItem(this._tokenKey);
  }

  /**
   * Get the token for the user
   *
   * @returns {string}
   */
  getToken(): string {
    return this._storage.getItem(this._tokenKey);
  }

  /**
   * Get the token for the user
   *
   * @returns {string}
   */
  setToken(token: string) {
    return this._storage.setItem(this._tokenKey, token);
  }

}
