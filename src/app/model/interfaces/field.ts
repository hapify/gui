
export interface IFieldBase {
  /**
   * The field's name
   *
   * @type {string}
   */
  name: string;
  /**
   * The field's type
   *
   * @type {string}
   */
  type: string;
  /**
   * Should be used as a primary key or not
   *
   * @type {boolean}
   */
  primary: boolean;
  /**
   * Indicate whether the field is searchable or not
   *
   * @type {boolean}
   */
  searchable: boolean;
  /**
   * Indicate whether the field is sortable or not
   *
   * @type {boolean}
   */
  sortable: boolean;
  /**
   * Indicate whether the field is private (should not be exposed)
   *
   * @type {boolean}
   */
  isPrivate: boolean;
  /**
   * Indicate whether the field is for an internal use only (should not be defined by an user)
   *
   * @type {boolean}
   */
  internal: boolean;
}

export interface IField extends IFieldBase {
  /**
   * Convert the instance to an object
   *
   * @returns {IFieldBase}
   */
  toObject(): IFieldBase;
  /**
   * Bind properties from the base object to this object
   *
   * @param {IFieldBase} object
   * @returns {void}
   */
  fromObject(object: IFieldBase): void;
  /**
   * Denotes if the field should be considered as empty
   *
   * @returns {boolean}
   */
  isEmpty(): boolean;
}
