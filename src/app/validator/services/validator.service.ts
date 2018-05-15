import {Injectable} from '@angular/core';
import {GeneratorService} from '../../generator/services/generator.service';
import {IValidatorResult} from '../interfaces/validator-result';
import {IModel} from '../../model/interfaces/model';

@Injectable()
export class ValidatorService {

  /**
   * Constructor
   *
   * @param {GeneratorService} generatorService
   */
  constructor(private generatorService: GeneratorService) {
  }

  /**
   * Run validation on a single model for a single channel
   *
   * @param {string} script
   * @param {IModel} _model
   * @return {Promise<IValidatorResult>}
   */
  async run(script: string, _model: IModel): Promise<IValidatorResult> {

    const model = await this.generatorService.inputs(_model);
    const result = <IValidatorResult>eval(script);

    if (!(result && result.errors instanceof Array && result.warnings instanceof Array)) {
      throw new Error('Invalid validator return. Must returns { errors: string[], warnings: string[] }');
    }

    return result;
  }

}
