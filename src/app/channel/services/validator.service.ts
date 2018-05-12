import {Injectable} from '@angular/core';
import {IValidatorResult} from '../interfaces/validator-result';
import {IModel} from '../../model/interfaces/model';

@Injectable()
export class ValidatorService {

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Run validation on a single model for a single channel
   *
   * @param {string} script
   * @param {IModel} model
   * @return {IValidatorResult}
   */
  run(script: string, model: IModel): IValidatorResult {
    return {
      errors: ['One error'],
      warnings: ['One warning'],
    };
  }

}
