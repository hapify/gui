export interface IStorableBase {
  /**
   * The object's unique id
   *
   * @type {string}
   */
  id: string;
}

export interface IStorable extends IStorableBase {
  /**
   * Convert the instance to an object
   *
   * @returns {IStorableBase}
   */
  toObject(): IStorableBase;

  /**
   * Bind properties from the base object to this object
   *
   * @param {IStorableBase} object
   * @returns {void}
   */
  fromObject(object: IStorableBase): void;
}
