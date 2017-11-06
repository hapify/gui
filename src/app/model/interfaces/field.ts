import {FieldType} from './field-type.enum';

export interface Field {
  name: string;
  type: FieldType;
  primary: boolean;
  searchable: boolean;
  sortable: boolean;
}
