import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toDate'
})
export class ToDate {
  transform(date:string): Date {
    return new Date(date);
  }
}
