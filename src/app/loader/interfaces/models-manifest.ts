export interface IFieldManifest {
  name: string;
  type: string;
  subtype: string;
  reference: string;
  primary: boolean;
  unique: boolean;
  label: boolean;
  nullable: boolean;
  multiple: boolean;
  searchable: boolean;
  sortable: boolean;
  isPrivate: boolean;
  internal: boolean;
}

export interface IModelManifest {
  id: string;
  name: string;
  fields: IFieldManifest[];
}
