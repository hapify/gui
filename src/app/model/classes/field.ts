import {IField, IFieldBase} from '../interfaces/field';
import {FieldType} from '../interfaces/field-type.enum';

export class Field implements IField {
  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * @inheritDoc
   */
  public name = '';
  /**
   * @inheritDoc
   */
  public type = FieldType.String;
  /**
   * @inheritDoc
   */
  public reference = null;
  /**
   * @inheritDoc
   */
  public primary = false;
  /**
   * @inheritDoc
   */
  public unique = false;
  /**
   * @inheritDoc
   */
  public label = false;
  /**
   * @inheritDoc
   */
  public searchable = false;
  /**
   * @inheritDoc
   */
  public sortable = false;
  /**
   * @inheritDoc
   */
  public isPrivate = false;
  /**
   * @inheritDoc
   */
  public internal = false;

  /**
   * @inheritDoc
   */
  public fromObject(object: IFieldBase): void {
    this.name = object.name;
    this.type = object.type;
    this.reference = object.reference;
    this.primary = object.primary;
    this.unique = object.unique;
    this.label = object.label;
    this.searchable = object.searchable;
    this.sortable = object.sortable;
    this.isPrivate = object.isPrivate;
    this.internal = object.internal;
  }

  /**
   * @inheritDoc
   */
  public toObject(): IFieldBase {
    return {
      name: this.name,
      type: this.type,
      reference: this.reference,
      primary: this.primary,
      unique: this.unique,
      label: this.label,
      searchable: this.searchable,
      sortable: this.sortable,
      isPrivate: this.isPrivate,
      internal: this.internal
    };
  }

  /**
   * @inheritDoc
   */
  public isEmpty(): boolean {
    return typeof this.name !== 'string'
      || this.name === null
      || this.name.length === 0;
  }
}
