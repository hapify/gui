import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectKeys'
})
export class ObjectKeysPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return typeof value === 'object' ? Object.keys(value) : [];
  }

}
