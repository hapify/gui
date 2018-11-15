import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// Services
import {GeneratorService} from './services/generator.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    GeneratorService,
  ],
})
export class GeneratorModule {
}

export {GeneratorService} from './services/generator.service';
