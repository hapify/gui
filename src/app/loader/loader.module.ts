import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BitbucketComponent} from './components/bitbucket/bitbucket.component';
import {TranslateModuleLoad} from '../translate-import';

import {ChannelModule, StorageService as ChannelStorageService} from '../channel/channel.module';
import {BitbucketService} from './services/bitbucket.service';
import {MasksService} from './services/masks.service';
import {BitbucketRepositoryLineComponent} from './components/bitbucket-repository-line/bitbucket-repository-line.component';
import {RootComponent} from './components/root/root.component';
import {FileComponent} from './components/file/file.component';
import {ModelsService} from './services/models.service';

@NgModule({
  imports: [
    CommonModule,
    ChannelModule,
    FormsModule,
    TranslateModuleLoad()
  ],
  declarations: [BitbucketComponent, BitbucketRepositoryLineComponent, RootComponent, FileComponent],
  providers: [
    ChannelStorageService,
    BitbucketService,
    MasksService,
    ModelsService
  ]
})
export class LoaderModule {
}

export {LOADER_ROUTES} from './loader.routing';
