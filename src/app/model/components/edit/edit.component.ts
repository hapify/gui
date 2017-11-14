import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {IModel} from '../../interfaces/model';
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
   * Model instance
   *
   * @type {IModel}
   */
  public model: IModel;

  /**
   * Constructor
   */
  constructor(private router: Router,
              private route: ActivatedRoute,
              private storageService: StorageService) { }

  /**
   * @inheritDoc
   */
  ngOnInit() {
    this._paramsSub = this.route.params.subscribe(async params => {
      // Get model id
      const id = params['id'];
      // Load model
      const model = await this.storageService.find(id);
      // Bind the model if any
      if (model) {
        this.model = model;
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
   * Called when the user update the model
   */
  onSave(): void {
    // Store the model
    this.storageService.update(this.model);
  }

}
