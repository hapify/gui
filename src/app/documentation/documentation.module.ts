import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { RootComponent } from '@app/documentation/components/root/root.component';
import { TranslateModuleLoad } from '@app/translate-import';

@NgModule({
	declarations: [RootComponent],
	imports: [CommonModule, SharedModule, TranslateModuleLoad()]
})
export class DocumentationModule {}

export { DOCUMENTATION_ROUTES } from './documentation.routing';
