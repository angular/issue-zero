import { Pipe, PipeTransform } from '@angular/core';
import { Label, Issue } from '../../shared/types';

@Pipe({
  name: 'isChecked'
})
export class IsChecked {
  transform (label: Label, [issue]: [Issue]): boolean {
    return issue ? issue.labels.filter(l => l.name === label.name).length === 1 : false;
  }
}
