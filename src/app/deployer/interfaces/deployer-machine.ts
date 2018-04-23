export interface IDeployerMachine {
  name: string;
  branch: string;
  stack: string;
  populate: boolean;
  subDomains?: string[];
  creation?: number;
  ip?: string;
}

export interface IDeployerMachinesList {
  count: number;
  list: IDeployerMachine[];
}
