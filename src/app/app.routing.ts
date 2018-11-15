import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ModelModule, MODEL_ROUTES} from './model/model.module';
import {ModelComponent} from './components/model/model.component';

import {ChannelModule, CHANNEL_ROUTES} from './channel/channel.module';
import {ChannelComponent} from './components/channel/channel.component';

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
  }
];

@NgModule({
  imports: [
    ModelModule,
    ChannelModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
