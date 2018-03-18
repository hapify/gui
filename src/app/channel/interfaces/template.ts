
export interface ITemplateBase {
  /**
   * The template's name
   *
   * @type {string}
   */
  name: string;
  /**
   * The template's path
   *
   * @type {string}
   */
  path: string;
  /**
   * The template's type
   *
   * @type {string}
   */
  engine: string;
  /**
   * Denotes if the template has to to be ran for one or all models
   *
   * @type {string}
   */
  input: string;
  /**
   * The template's content
   *
   * @type {string}
   */
  content: string;
}

export interface ITemplate extends ITemplateBase {
  /**
   * Convert the instance to an object
   *
   * @returns {ITemplateBase}
   */
  toObject(): ITemplateBase;
  /**
   * Bind properties from the base object to this object
   *
   * @param {ITemplateBase} object
   * @returns {void}
   */
  fromObject(object: ITemplateBase): void;
  /**
   * Create a clone of this template
   *
   * @returns {ITemplate}
   */
  clone(): ITemplate;
  /**
   * Get the extension of the input file
   *
   * @returns {string}
   */
  extension(): string;
  /**
   * Get the Ace Editor's mode of the input file
   *
   * @returns {string}
   */
  aceMode(): string;
  /**
   * Denotes if the template should be considered as empty
   *
   * @returns {boolean}
   */
  isEmpty(): boolean;
  /**
   * Denotes if the template needs a specific model to be generated
   *
   * @returns {boolean}
   */
  needsModel(): boolean;
}
