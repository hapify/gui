import {Component, OnDestroy, OnInit} from '@angular/core';
import {MachinesService} from '../../services/machines.service';
import {IDeployerMachine} from '../../interfaces/deployer-machine';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-deployer-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss']
})
export class MachinesComponent implements OnInit, OnDestroy {

  /**
   * Observables subscriptions
   */
  subs: Subscription[] = [];

  /**
   * Machine list
   *
   * @type {Array}
   */
  machines: IDeployerMachine[] = [];

  /**
   * Constructor
   *
   * @param machinesService
   */
  constructor(private machinesService: MachinesService) { }

  /**
   * On init
   */
  ngOnInit() {
    this.subs = [
      this.machinesService.list().subscribe((list: IDeployerMachine[]) => {
        this.machines = list;
      })
    ];
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }

}
