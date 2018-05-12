export interface ITemplateManifest {
  name: string;
  path: string;
  engine: string;
  input: string;
  content: string;
}

export interface IChannelManifest {
  id: string;
  name: string;
  masks: ITemplateManifest[];
  validator: string;
}

export interface IMasksManifest {
  channels: IChannelManifest[];
}
