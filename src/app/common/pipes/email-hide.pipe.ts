import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailHide'
})
export class EmailHidePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
