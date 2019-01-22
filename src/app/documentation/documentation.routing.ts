import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RootComponent } from '@app/documentation/components/root/root.component';

export const DOCUMENTATION_ROUTES: Routes = [
	{
		path: '',
		component: RootComponent
	}
];

@NgModule({
	imports: [RouterModule],
	exports: []
})
export class AppRoutingModule {}
