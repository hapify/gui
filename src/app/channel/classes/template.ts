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
  public path = '';
  /**
   * @inheritDoc
   */
  public type: TemplateType = TemplateType.Basic;
  /**
   * @inheritDoc
   */
  public content = '';

  /**
   * @inheritDoc
   */
  public fromObject(object: ITemplateBase): void {
    this.path = object.path;
    this.type = object.type;
    this.content = object.content;
  }

  /**
   * @inheritDoc
   */
  public toObject(): ITemplateBase {
    return {
      path: this.path,
      type: this.type,
      content: this.content
    };
  }

  /**
   * @inheritDoc
   */
  public isEmpty(): boolean {
    return typeof this.content !== 'string'
      || this.content === null
      || this.content.trim().length === 0;
  }
}
