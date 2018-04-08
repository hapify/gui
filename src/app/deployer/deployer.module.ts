import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModuleLoad} from '../translate-import';

import {RootComponent} from './components/root/root.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModuleLoad()
  ],
  declarations: [
    RootComponent
  ],
  providers: [
  ]
})
export class DeployerModule {
}

export {DEPLOYER_ROUTES} from './deployer.routing';
