import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ModelNewComponent} from './components/model/model-new/model-new.component';

export const routes: Routes = [
  {
    path: '',
    component: ModelNewComponent,
    data: {
      title: 'New model'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
