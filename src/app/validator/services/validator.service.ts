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
   * @return {Promise<IValidatorResult>}
   */
  async run(script: string, model: IModel): Promise<IValidatorResult> {

    // No script, no error
    if (typeof script === 'undefined' || script.length === 0) {
      return {
        errors: [],
        warnings: []
      };
    }

    const result = <IValidatorResult>eval(script);

    if (!(result && result.errors instanceof Array && result.warnings instanceof Array)) {
      throw new Error('Invalid validator return. Must returns { errors: string[], warnings: string[] }');
    }

    return result;
  }

}
