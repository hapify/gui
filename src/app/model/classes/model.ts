import {IModel, IModelBase} from '../interfaces/model';
import {IField, IFieldBase} from '../interfaces/field';
import {Context, IContexts} from '../interfaces/context';
import {Field} from './field';

export class Model implements IModel {
  /**
   * Constructor
   * Auto-generate unique id
   */
  constructor() {
    this.id = this.guid();
  }

  /**
   * @inheritDoc
   */
  public id: string;
  /**
   * @inheritDoc
   */
  public name = '';
  /**
   * @inheritDoc
   */
  public fields: IField[] = [];
  /**
   * @inheritDoc
   */
  public contexts: IContexts = {
    create: Context.GUEST,
    read: Context.GUEST,
    update: Context.GUEST,
    remove: Context.GUEST,
    search: Context.GUEST,
    count: Context.GUEST,
  };

  /**
   * Randomly generate id
   *
   * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
   * @returns {string}
   */
  protected guid(): string {
    function _p8(s?: boolean) {
      const p = (Math.random().toString(16) + '000000000').substr(2, 8);
      return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
    }

    return _p8() + _p8(true) + _p8(true) + _p8();
  }

  /**
   * @inheritDoc
   */
  public newField(): IField {
    return new Field();
  }

  /**
   * @inheritDoc
   */
  public addField(field: IField): void {
    this.fields.push(field);
  }

  /**
   * @inheritDoc
   */
  public fromObject(object: IModelBase): void {
    this.id = object.id;
    this.name = object.name;
    this.fields = object.fields.map((fieldBase: IFieldBase): IField => {
      const field = this.newField();
      field.fromObject(fieldBase);
      return field;
    });
    this.contexts = object.contexts;
  }

  /**
   * @inheritDoc
   */
  public toObject(): IModelBase {
    return {
      id: this.id,
      name: this.name,
      fields: this.fields
        .filter((field: IField): boolean => !field.isEmpty())
        .map((field: IField): IFieldBase => field.toObject()),
      contexts: this.contexts
    };
  }

  /**
   * @inheritDoc
   */
  public isEmpty(): boolean {
    const nameIsEmpty = typeof this.name !== 'string'
      || this.name === null
      || this.name.length === 0;
    const fieldsAreEmpty = this.fields.every((field: IField): boolean => field.isEmpty());

    return nameIsEmpty || fieldsAreEmpty;
  }

  /**
   * @inheritDoc
   */
  public filter(): void {
    this.fields = this.fields.filter((field: IField): boolean => {
      return !field.isEmpty();
    });
  }

  /**
   * @inheritDoc
   */
  public clone(): IModel {
    const model = new Model();
    const id = model.id;
    model.fromObject(this.toObject());
    model.id = id;
    return model;
  }
}
