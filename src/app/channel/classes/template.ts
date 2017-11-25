import {ITemplate, ITemplateBase} from '../interfaces/template';
import {TemplateEngine} from '../interfaces/template-engine.enum';

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
  public path = '';
  /**
   * @inheritDoc
   */
  public engine: TemplateEngine = TemplateEngine.doT;
  /**
   * @inheritDoc
   */
  public content = '';

  /**
   * @inheritDoc
   */
  public fromObject(object: ITemplateBase): void {
    this.name = object.name;
    this.path = object.path;
    this.engine = Number(object.engine);
    this.content = object.content;
  }

  /**
   * @inheritDoc
   */
  public toObject(): ITemplateBase {
    return {
      name: this.name,
      path: this.path,
      engine: Number(this.engine),
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
