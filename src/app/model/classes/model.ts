import {IModel, IModelBase} from '../interfaces/model';
import {IField, IFieldBase} from '../interfaces/field';
import {Field} from './field';

export class Model implements IModel {
  /**
   * Constructor
   */
  constructor() {}
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
  newField(): IField {
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
    this.name = object.name;
    this.fields = object.fields.map((fieldBase: IFieldBase): IField => {
      const field = this.newField();
      field.fromObject(fieldBase);
      return field;
    });
  }
  /**
   * @inheritDoc
   */
  public toObject(): IModelBase {
    return {
      name: this.name,
      fields: this.fields.map((field: IField): IFieldBase => {
        return field.toObject();
      })
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
  public serialize(): string {
    const object = this.toObject();
    return JSON.stringify(object);
  }
  /**
   * @inheritDoc
   */
  public unserialize(data: string): void {
    const object: IModelBase = typeof data === 'string' && data.length ?
      JSON.parse(data) : null;
    // If the json was not valid, do not change the current instance.
    if (object) {
      this.fromObject(object);
    }
  }
}
