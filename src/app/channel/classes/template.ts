import {ITemplate, ITemplateBase} from '../interfaces/template';
import {TemplateEngine} from '../interfaces/template-engine.enum';
import {TemplateInput} from '../interfaces/template-input.enum';

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
  public engine = TemplateEngine.doT;
  /**
   * @inheritDoc
   */
  public input = TemplateInput.One;
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
    this.engine = object.engine;
    this.input = object.input;
    this.content = object.content;
  }

  /**
   * @inheritDoc
   */
  public toObject(): ITemplateBase {
    return {
      name: this.name,
      path: this.path,
      engine: this.engine,
      input: this.input,
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

  /**
   * @inheritDoc
   */
  public needsModel(): boolean {
    return this.input === TemplateInput.One;
  }

  /**
   * @inheritDoc
   */
  public clone(): ITemplate {
    const output = new Template();
    output.fromObject(this.toObject());

    return output;
  }
}
