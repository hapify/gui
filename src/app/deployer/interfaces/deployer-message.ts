export interface IDeployerMessage {
  id: string;
  type: string;
  date?: Date;
  data: any;
}

export class DeployerMessages {
  static REQUEST = 'clientRequest';
  static CHANNEL = 'clientChannel';
  static CANCEL = 'clientCancel';
}

export class DeployerOrders {
  static SEND_REQUEST = 'sendRequest';
  static NEXT_CHANNEL = 'nextChannel';
}
