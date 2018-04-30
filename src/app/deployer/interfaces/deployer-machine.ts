export interface IDeployerMachine {
  name: string;
  branch: string;
  stack: string;
  populate: boolean;
  pending?: boolean;
  urls?: any;
  creation?: number;
  ip?: string;
}

export interface IDeployerMachinesList {
  count: number;
  list: IDeployerMachine[];
}
