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
  static NEXT_CHANNEL = 'nextChannel';
}

export class DeployerInfo {
  static ACCEPTED = 'requestAccepted';
  static SUCCESS = 'deploymentFinished';
}

