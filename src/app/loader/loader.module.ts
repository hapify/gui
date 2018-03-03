import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BitbucketComponent} from './components/bitbucket/bitbucket.component';
import {TranslateModuleLoad} from '../translate-import';

import {ChannelModule, StorageService as ChannelStorageService} from '../channel/channel.module';
import {BitbucketService} from './services/bitbucket.service';

@NgModule({
  imports: [
    CommonModule,
    ChannelModule,
    TranslateModuleLoad()
  ],
  declarations: [BitbucketComponent],
  providers: [
    ChannelStorageService,
    BitbucketService
  ]
})
export class LoaderModule {
}
export {LOADER_ROUTES} from './loader.routing';
