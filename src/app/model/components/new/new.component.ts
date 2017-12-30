import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Model} from '../../classes/model';
import {FieldType} from '../../interfaces/field-type.enum';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-model-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  /**
   * Constructor
   */
  constructor(private router: Router,
              private route: ActivatedRoute,
              private translateService: TranslateService,
              private storageService: StorageService) {
  }

  /**
   * New model instance
   *
   * @type {Model}
   */
  public model: Model;

  /**
   * @inheritDoc
   */
  ngOnInit() {
    // New model
    this.model = new Model();
    // Default field
    const field = this.model.newField();
    field.name = 'id';
    field.type = FieldType.Number;
    field.primary = true;
    field.internal = true;
    this.model.addField(field);
    // Get default name
    this.translateService.get('new_model_name').subscribe((text) => {
      this.model.name = text;
    });
  }

  /**
   * Called when the user save the new model
   */
  onSave(): void {
    // Store the model
    this.storageService.add(this.model)
      .then(() => {
        // Go to edit page
        this.router.navigate(['../edit', this.model.id], {relativeTo: this.route});
      });
  }


}
