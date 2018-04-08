export interface IDeployerMessage {
  id: string;
  type: string;
  date?: Date;
  data: any;
}

export class DeployerMessages {
  static REQUEST = 'clientRequest';
}
