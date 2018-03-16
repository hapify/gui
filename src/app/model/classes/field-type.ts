import {ILabelledValue} from '../interfaces/labelled-value';

export class FieldType {
  static Boolean = 'boolean';
  static Number = 'number';
  static String = 'string';
  static DateTime = 'datetime';
  static Entity = 'entity';

  /**
   * Get the list of available types with names
   *
   * @returns {ILabelledValue[]}
   */
  static list(): ILabelledValue[] {
    return [
      {name: 'String', value: FieldType.String},
      {name: 'Number', value: FieldType.Number},
      {name: 'Boolean', value: FieldType.Boolean},
      {name: 'DateTime', value: FieldType.DateTime},
      {name: 'Entity', value: FieldType.Entity}
    ];
  }
}
