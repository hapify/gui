import { Injectable } from '@angular/core';
import {ConfigService} from '../../services/config.service';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {IBitbucketUser} from '../interfaces/bitbucket-user';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {BitbucketRepositoriesResponse, IBitbucketRepository} from '../interfaces/bitbucket-repository';
import {BitbucketBranchesResponse} from '../interfaces/bitbucket-branch';

export interface GroupedBitbucketRepositories {
  templates: IBitbucketRepository[];
  bootstraps: IBitbucketRepository[];
  models: IBitbucketRepository[];
}

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
  private _user: IBitbucketUser = null;
  private _userSubject = new BehaviorSubject<IBitbucketUser|null>(null);
  private _userObservable: Observable<IBitbucketUser|null> = this._userSubject.asObservable();

  /**
   * Loaded repositories from Bitbucket
   *
   * @private
   */
  private _repositories: GroupedBitbucketRepositories = null;
  private _repositoriesSubject = new BehaviorSubject<GroupedBitbucketRepositories|null>(null);
  private _repositoriesObservable: Observable<GroupedBitbucketRepositories|null> = this._repositoriesSubject.asObservable();

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

    this._user = null;
    this._repositories = null;
    this._userSubject.next(null);
    this._repositoriesSubject.next(null);
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
   * Returns the repositories observable
   *
   * @returns {Observable<GroupedBitbucketRepositories>}
   */
  getRepositories(): Observable<GroupedBitbucketRepositories> {
    return this._repositoriesObservable;
  }

  /**
   * Returns the repositories observable
   *
   * @returns {Observable<GroupedBitbucketRepositories>}
   */
  getRepositorySource(repository: IBitbucketRepository): Promise<any> {

    const url = `https://bitbucket.org/tractrs/${repository.name}/get/${repository.selected_branch.target.hash}.zip`;

    return this.http.get(url, {headers: this._getRequestHeaders()})
      .toPromise()
      .then((response) => {
        console.log(response);
      });
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
   * @returns {Promise<void>}
   * @private
   */
  private _getRepositories(): Promise<void> {

    const url = `${this.configService.getBitbucketBaseUri()}/repositories/tractrs?pagelen=100&q=project.key="HAP"`;
    const headers = this._getRequestHeaders();

    return this.http.get(url, {headers})
      .toPromise()
      .then(async (response: BitbucketRepositoriesResponse) => {
        // Get branches for all repositories
        response.values = await Promise.all(response.values.map(async (repo) => {
          repo.branches = await this.http.get(`${repo.links.branches.href}/?pagelen=20`, {headers})
            .toPromise()
            .then((branchesResponse: BitbucketBranchesResponse) => {
              return branchesResponse.values;
            });
          repo.selected_branch = repo.branches.find((branch) => {
            return branch.name === repo.mainbranch.name;
          });
          return repo;
        }));
        return response;
      })
      .then((response: BitbucketRepositoriesResponse) => {
        this._repositories = {
          templates: response.values.filter((r) => r.name.indexOf('hapify-masks') === 0),
          bootstraps: response.values.filter((r) => r.name.indexOf('hapify-bootstrap') === 0),
          models: response.values.filter((r) => r.name.indexOf('hapify-models') === 0)
        };
        this._repositoriesSubject.next(this._repositories);
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
