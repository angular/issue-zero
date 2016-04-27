import {Component, EventEmitter, Input, Output} from 'angular2/core';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';

@Component({
  selector: 'issue-row',
  template: `
    <md-list-item>
      <img md-list-avatar [src]="issue.user.avatar_url + '&s=40'" alt="{{issue.user.login}} logo">
      <span md-line> {{issue.title}} </span>
      <p md-line class="secondary">
        @{{issue.user.login}}
        -
        {{issue.body}}
      </p>
    <md-list-item>
  `,
  styles: [`
    [md-line].secondary {
      color: rgba(0,0,0,0.54);
    }
  `],
  providers: [],
  directives: [MD_LIST_DIRECTIVES],
  pipes: []
})
export class IssueRow {
  @Input('issue') issue:any;

  constructor() {}

}
