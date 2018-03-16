import {ILabelledValue} from '../interfaces/labelled-value';

export class FieldSubType {
  static Boolean = {
    Default: null
  };
  static Number = {
    Default: null,
    Integer: 'integer',
    Float: 'float',
    Latitude: 'latitude',
    Longitude: 'longitude'
  };
  static String = {
    Default: null,
    Email: 'email',
    Password: 'password',
    LongText: 'long'
  };
  static DateTime = {
    Default: null,
    Date: 'date',
    Time: 'time'
  };
  static Entity = {
    Default: null
  };

  /**
   * Get the list of sub types for boolean
   *
   * @returns {ILabelledValue[]}
   */
  static boolean(): ILabelledValue[] {
    return [
      {name: '-', value: FieldSubType.Boolean.Default}
    ];
  }

  /**
   * Get the list of sub types for number
   *
   * @returns {ILabelledValue[]}
   */
  static number(): ILabelledValue[] {
    return [
      {name: '-', value: FieldSubType.Number.Default},
      {name: 'Integer', value: FieldSubType.Number.Integer},
      {name: 'Float', value: FieldSubType.Number.Float},
      {name: 'Latitude', value: FieldSubType.Number.Latitude},
      {name: 'Longitude', value: FieldSubType.Number.Longitude}
    ];
  }

  /**
   * Get the list of sub types for string
   *
   * @returns {ILabelledValue[]}
   */
  static string(): ILabelledValue[] {
    return [
      {name: '-', value: FieldSubType.String.Default},
      {name: 'Email', value: FieldSubType.String.Email},
      {name: 'Password', value: FieldSubType.String.Password},
      {name: 'Long Text', value: FieldSubType.String.LongText}
    ];
  }

  /**
   * Get the list of sub types for datetime
   *
   * @returns {ILabelledValue[]}
   */
  static datetime(): ILabelledValue[] {
    return [
      {name: '-', value: FieldSubType.DateTime.Default},
      {name: 'Date', value: FieldSubType.DateTime.Date},
      {name: 'Time', value: FieldSubType.DateTime.Time}
    ];
  }

  /**
   * Get the list of sub types for entity
   *
   * @returns {ILabelledValue[]}
   */
  static entity(): ILabelledValue[] {
    return [
      {name: '-', value: FieldSubType.Entity.Default}
    ];
  }
}
