import { Injectable } from '@angular/core';
import {ConfigService} from '../../services/config.service';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {IBitbucketUser} from '../interfaces/bitbucket-user';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class BitbucketService {

  /**
   * @type {string}
   * @private
   */
  private _tokenKey = 'bitbucket-token';

  /**
   * RegExp used to extract token from URL fragment
   *
   * @type {RegExp}
   * @private
   */
  private _tokenExtractor = /access_token=([0-9a-zA-Z-_%]+)/g;

  /**
   * The storage used to keep data
   *
   * @type {Storage}
   * @private
   */
  private _storage: Storage = localStorage;

  /**
   * Loaded user from Bitbucket
   *
   * @private
   */
  private _user: IBitbucketUser;

  /**
   * Subject for the user
   *
   * @type {Observable<IBitbucketUser>}
   * @private
   */
  private _userSubject = new Subject<IBitbucketUser|void>();

  /**
   * Observable for the user
   *
   * @type {Observable<IBitbucketUser>}
   * @private
   */
  private _userObservable: Observable<IBitbucketUser|void> = this._userSubject.asObservable();

  /**
   * Constructor
   *
   * @param {ConfigService} configService
   * @param {HttpClient} http
   */
  constructor(private configService: ConfigService,
              private http: HttpClient) {
    if (this._hasToken()) {
      this._load();
    }
  }

  /**
   * User is already connected to Bitbucket
   *
   * @returns {boolean}
   * @private
   */
  private _hasToken(): boolean {
    return !!this._getToken();
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
    this._userSubject.next();
  }

  /**
   * Get the token for the user
   *
   * @returns {string}
   * @private
   */
  private _getToken(): string {
    return this._storage.getItem(this._tokenKey);
  }

  /**
   * Get the token for the user
   *
   * @param {string} token
   */
  setToken(token: string) {
    this._storage.setItem(this._tokenKey, token);
    this._load();
  }

  /**
   * Returns the user observable
   *
   * @returns {Observable<IBitbucketUser>}
   */
  getUser(): Observable<IBitbucketUser> {
    return this._userObservable;
  }

  /**
   * Extract token from a fragment
   *
   * @param {string} fragment
   * @returns {string|null}
   */
  extractToken(fragment: string): string {
    const token = this._tokenExtractor.exec(fragment);
    return token ? decodeURIComponent(token[1]) : null;
  }

  /**
   * Load the user and the repositories after login
   *
   * @returns {Promise<void>}
   * @private
   */
  private _load(): Promise<void> {
    return this._getUser()
      .then(() => this._getRepositories());
  }

  /**
   * Get the current user.
   * In case of 4xx error, we assume the token is wrong and disconnect the user.
   *
   * @returns {Promise<void>}
   * @private
   */
  private _getUser(): Promise<void> {
    const url = `${this.configService.getBitbucketBaseUri()}/user`;

    return this.http.get(url, {headers: this._getRequestHeaders()})
      .toPromise()
      .then((user: IBitbucketUser) => {
        this._user = user;
        this._userSubject.next(user);
      })
      .catch((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status >= 400 && error.status <= 499) {
          this.disconnect();
        }
      });
  }

  /**
   * Get the repositories current user.
   *
   * @returns {Promise<IBitbucketUser|void>}
   * @private
   */
  private _getRepositories(): Promise<IBitbucketUser|void> {
    const url = `${this.configService.getBitbucketBaseUri()}/repositories/tractrs?pagelen=100&q=project.key="HAP"`;

    return this.http.get(url, {headers: this._getRequestHeaders()})
      .toPromise()
      .then((user: IBitbucketUser) => {
      })
      .catch((error: HttpErrorResponse) => {
        console.log(error);
      });
  }

  /**
   * Returns the commons headers for a request
   *
   * @param {HttpHeaders} headers
   * @returns {HttpHeaders}
   * @private
   */
  private _getRequestHeaders(headers: HttpHeaders = new HttpHeaders()): HttpHeaders {
    headers = headers.append('Authorization', `Bearer ${this._getToken()}`);
    return headers;
  }
}
