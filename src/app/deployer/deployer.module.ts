import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModuleLoad} from '../translate-import';

import {RootComponent} from './components/root/root.component';
import { ConsoleComponent } from './components/console/console.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModuleLoad()
  ],
  declarations: [
    RootComponent,
    ConsoleComponent
  ],
  providers: [
  ]
})
export class DeployerModule {
}

export {DEPLOYER_ROUTES} from './deployer.routing';
