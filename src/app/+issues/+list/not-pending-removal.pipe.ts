import { Pipe, PipeTransform } from '@angular/core';
import { Issue } from '../../shared/types';

@Pipe({
  name: 'notPendingRemoval'
})
export class NotPendingRemoval implements PipeTransform {
  transform (issues:Issue[]): Issue[] {
    if (!issues) return issues;
    return issues.filter((issue:Issue) => !issue.isPendingRemoval)
  }
}
