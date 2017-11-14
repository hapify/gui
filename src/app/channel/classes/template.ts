import {ITemplate, ITemplateBase} from '../interfaces/template';
import {TemplateType} from '../interfaces/template-type.enum';

export class Template implements ITemplate {
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
  public type: TemplateType = TemplateType.String;
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
  public fromObject(object: ITemplateBase): void {
    this.name = object.name;
    this.type = object.type;
    this.primary = object.primary;
    this.searchable = object.searchable;
    this.sortable = object.sortable;
  }

  /**
   * @inheritDoc
   */
  public toObject(): ITemplateBase {
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
