import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {IModel} from '../../interfaces/model';
import {IField} from '../../interfaces/field';
import {StorageService} from '../../services/storage.service';
import {FieldType} from '../../classes/field-type';

@Component({
  selector: 'app-model-model-uml-box',
  templateUrl: './model-uml-box.component.html',
  styleUrls: ['./model-uml-box.component.scss']
})
export class ModelUmlBoxComponent implements OnInit {

  /** Link to FieldType class */
  fieldType = FieldType;
  /** @type {IModel[]} Models availables */
  models: IModel[];

  /**
   * Constructor
   *
   * @param {StorageService} storageService
   */
  constructor(private storageService: StorageService) {
    // Get available models
    this.storageService.list()
      .then((models) => {
        this.models = models;
      });
  }

  /**
   * Model instance
   *
   * @type {IModel}
   */
  @Input() model: IModel;
  /**
   * On delete event
   *
   * @type {EventEmitter<void>}
   */
  @Output() onDelete = new EventEmitter<void>();
  /**
   * On clone event
   *
   * @type {EventEmitter<void>}
   */
  @Output() onClone = new EventEmitter<void>();
  /**
   * @type {boolean}
   */
  deleteSwitch = false;

  /**
   * @inheritDoc
   */
  ngOnInit() {
  }

  /**
   * Called when the user click on "delete"
   */
  didClickDelete() {
    this.onDelete.emit();
  }

  /**
   * Called when the user click on "clone"
   */
  didClickClone() {
    this.onClone.emit();
  }

  /**
   * Get the model name for an entity reference
   *
   * @param {IField} field
   * @return {string|null}
   */
  getModelName(field: IField) {
    if (field.type !== FieldType.Entity || !this.models) {
      return null;
    }
    const model = this.models.find((m) => m.id === field.reference);
    return model ? model.name : '-';
  }
}
