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
  public type: FieldType = FieldType.String;
  /**
   * @inheritDoc
   */
  public primary = false;
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
  public fromObject(object: IFieldBase): void {
    this.name = object.name;
    this.type = object.type;
    this.primary = object.primary;
    this.searchable = object.searchable;
    this.sortable = object.sortable;
  }

  /**
   * @inheritDoc
   */
  public toObject(): IFieldBase {
    return {
      name: this.name,
      type: this.type,
      primary: this.primary,
      searchable: this.searchable,
      sortable: this.sortable,
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
