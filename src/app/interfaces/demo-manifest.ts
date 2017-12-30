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

export interface DemoManifest {
  clean: boolean;
  channels: DemoChannel[];
}


