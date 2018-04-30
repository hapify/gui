import { Injectable } from '@angular/core';
import {ConfigService} from '../../services/config.service';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {IDeployerMachine, IDeployerMachinesList} from '../interfaces/deployer-machine';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DeployerService} from './deployer.service';
import {DeployerInfo, IDeployerMessage} from '../interfaces/deployer-message';

@Injectable()
export class MachinesService {

  /**
   * Observable for listing
   */
  private _listSubject = new BehaviorSubject<IDeployerMachine[]>([]);
  private _listObservable: Observable<IDeployerMachine[]> = this._listSubject.asObservable();

  /**
   * Constructor
   *
   * @param configService
   * @param http
   * @param deployerService
   */
  constructor(private configService: ConfigService,
              private http: HttpClient,
              private deployerService: DeployerService
  ) {
    // Refresh once
    this.refresh();
    // If the machine is created of finished or an error occured, update the list
    this.deployerService.messages().subscribe((message: IDeployerMessage) => {
      if (message.id === DeployerInfo.ACCEPTED ||
          message.id === DeployerInfo.SUCCESS ||
          message.type === 'error') {
        this.refresh();
      }
    });
  }

  /**
   * Get the list observable
   *
   * @return {Observable<IDeployerMachine[]>}
   */
  list(): Observable<IDeployerMachine[]> {
    return this._listObservable;
  }

  /**
   * Get the last version of machines' list
   *
   * @return {Promise<void>}
   */
  remove(name): Promise<void> {
    const url = `${this.configService.getDeployerMachinesUrl()}/${name}`;
    return this.http.delete(url, {headers: this.getApiHeaders()})
      .toPromise()
      .then(() => {
        return this.refresh();
      })
      .catch((error: HttpErrorResponse) => {
        console.error(error);
      });
  }

  /**
   * Get the last version of machines' list
   *
   * @return {Promise<void>}
   */
  private refresh(): Promise<void> {
    const url = this.configService.getDeployerMachinesUrl();
    return this.http.get(url, {headers: this.getApiHeaders()})
      .toPromise()
      .then((response: IDeployerMachinesList) => {
        this._listSubject.next(response.list);
      })
      .catch((error: HttpErrorResponse) => {
        console.error(error);
      });
  }

  /**
   * Get the headers required to request something on the API
   *
   * @return {HttpHeaders}
   */
  private getApiHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('X-Hapify-Id', this.configService.getDeployerSessionId());
    headers = headers.append('X-Hapify-Key', this.configService.getDeployerSessionKey());

    return headers;
  }

}
