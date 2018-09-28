import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AlertModule, TooltipModule} from 'ngx-bootstrap';
import {AceEditorModule} from 'ng2-ace-editor';
import {TranslateModuleLoad} from '../translate-import';

// Components
import {SimpleComponent} from './components/simple/simple.component';

// Services
import {GeneratorService} from './services/generator.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AceEditorModule,
    TranslateModuleLoad(),
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
  ],
  declarations: [
    SimpleComponent
  ],
  providers: [
    GeneratorService,
  ],
})
export class GeneratorModule {
}

export {GENERATOR_ROUTES} from './generator.routing';
export {GeneratorService} from './services/generator.service';
