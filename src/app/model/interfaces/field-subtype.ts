export class FieldSubType {
  static Boolean = null;
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
  static Entity = null;
}
