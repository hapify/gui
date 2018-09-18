export interface IWebsocketMessage {
  id: string;
  type: string;
  date?: Date;
  data: any;
}

export class WebsocketMessages {
  static REQUEST = 'clientRequest';
  static CHANNEL = 'clientChannel';
  static CANCEL = 'clientCancel';
}
