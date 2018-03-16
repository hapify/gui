export interface DemoTemplate {
  name: string;
  path: string;
  engine: string;
  input: string;
  content: string;
}

export interface DemoChannel {
  load: boolean;
  id: string;
  name: string;
  templates: DemoTemplate[];
}

export interface DemoField {
  name: string;
  type: string;
  subtype: string;
  reference: string;
  primary: boolean;
  unique: boolean;
  nullable: boolean;
  multiple: boolean;
  label: boolean;
  searchable: boolean;
  sortable: boolean;
  isPrivate: boolean;
  internal: boolean;
}

export interface DemoModel {
  id: string;
  name: string;
  fields: DemoField[];
}

export interface DemoManifest {
  clean: boolean;
  channels: DemoChannel[];
  models: DemoModel[];
}
