import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TimeAgoPipe} from 'time-ago-pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModuleLoad} from '../translate-import';

import {RootComponent} from './components/root/root.component';
import { ConsoleComponent } from './components/console/console.component';

import {DeployerService} from './services/deployer.service';
import {MachinesService} from './services/machines.service';
import { MachinesComponent } from './components/machines/machines.component';
import { ObjectKeysPipe } from './pipes/object-keys.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModuleLoad()
  ],
  declarations: [
    RootComponent,
    ConsoleComponent,
    MachinesComponent,
    TimeAgoPipe,
    ObjectKeysPipe
  ],
  providers: [
    DeployerService,
    MachinesService
  ]
})
export class DeployerModule {
}

export {DEPLOYER_ROUTES} from './deployer.routing';
