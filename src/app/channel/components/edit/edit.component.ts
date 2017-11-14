import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {IChannel} from '../../interfaces/channel';
import {Router, ActivatedRoute} from '@angular/router';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  /**
   * Route params subscription
   *
   * @type {Subscription}
   * @private
   */
  private _paramsSub: Subscription;
  /**
   * Channel instance
   *
   * @type {IChannel}
   */
  public channel: IChannel;

  /**
   * Constructor
   */
  constructor(private router: Router,
              private route: ActivatedRoute,
              private storageService: StorageService) {
  }

  /**
   * @inheritDoc
   */
  ngOnInit() {
    this._paramsSub = this.route.params.subscribe(async params => {
      // Get channel id
      const id = params['id'];
      // Load channel
      const channel = await this.storageService.find(id);
      // Bind the channel if any
      if (channel) {
        this.channel = channel;
      }
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    this._paramsSub.unsubscribe();
  }

  /**
   * Called when the user update the channel
   */
  onSave(): void {
    // Store the channel
    this.storageService.update(this.channel);
  }

}
