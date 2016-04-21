import {Component, EventEmitter, Input, Output} from 'angular2/core';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';

// truncate.ts
import {Pipe} from 'angular2/core'

@Pipe({
  name: 'truncate'
})
export class TruncatePipe {
  transform(value: string, args: string[]) : string {
    let limit = args.length > 0 ? parseInt(args[0], 10) : 10;
    let trail = args.length > 1 ? args[1] : '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}


@Component({
  selector: 'issue-row',
  template: `
    <md-list-item>
      <img md-list-avatar [src]="issue.user.avatar_url + '&s=40'" alt="{{issue.user.login}} logo">
      <span md-line> {{issue.title}} </span>
      <p md-line>
        @{{issue.user.login}} -- {{issue.body | truncate: 140 : '...' }}
      </p>
    <md-list-item>
  `,
  providers: [],
  directives: [MD_LIST_DIRECTIVES],
  pipes: [TruncatePipe]
})
export class IssueRow {
  @Input('issue') issue:any;

  constructor() {}

}
