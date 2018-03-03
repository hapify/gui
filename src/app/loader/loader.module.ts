import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BitbucketComponent} from './components/bitbucket/bitbucket.component';
import {TranslateModuleLoad} from '../translate-import';

import {ChannelModule, StorageService as ChannelStorageService} from '../channel/channel.module';

@NgModule({
  imports: [
    CommonModule,
    ChannelModule,
    TranslateModuleLoad()
  ],
  declarations: [BitbucketComponent],
  providers: [ChannelStorageService]
})
export class LoaderModule {
}
export {LOADER_ROUTES} from './loader.routing';
