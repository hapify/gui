import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ModelModule, MODEL_ROUTES} from './model/model.module';
import {ModelComponent} from './components/model/model.component';

import {ChannelModule, CHANNEL_ROUTES} from './channel/channel.module';
import {ChannelComponent} from './components/channel/channel.component';

import {GeneratorModule, GENERATOR_ROUTES} from './generator/generator.module';
import {GeneratorComponent} from './components/generator/generator.component';

import {LoaderModule, LOADER_ROUTES} from './loader/loader.module';
import {LoaderComponent} from './components/loader/loader.component';

import {DeployerModule, DEPLOYER_ROUTES} from './deployer/deployer.module';
import {DeployerComponent} from './components/deployer/deployer.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/model',
    pathMatch: 'full'
  },
  {
    path: 'model',
    component: ModelComponent,
    children: MODEL_ROUTES
  },
  {
    path: 'channel',
    component: ChannelComponent,
    children: CHANNEL_ROUTES
  },
  {
    path: 'generator',
    component: GeneratorComponent,
    children: GENERATOR_ROUTES
  },
  {
    path: 'loader',
    component: LoaderComponent,
    children: LOADER_ROUTES
  },
  {
    path: 'deployer',
    component: DeployerComponent,
    children: DEPLOYER_ROUTES
  }
];

@NgModule({
  imports: [
    ModelModule,
    ChannelModule,
    GeneratorModule,
    LoaderModule,
    DeployerModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
