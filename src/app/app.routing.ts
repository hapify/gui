import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ModelModule, MODEL_ROUTES} from './model/model.module';

import {ModelComponent} from './components/model/model.component';

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
  }
];

@NgModule({
  imports: [
    ModelModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
