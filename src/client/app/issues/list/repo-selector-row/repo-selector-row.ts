import {Component, EventEmitter, Input, Output} from 'angular2/core';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';

@Component({
  selector: 'repo-selector-row',
  styles: [`
    .md-list-item {
      background-color: rgb(245, 245, 245)
    }
  `],
  template: `
    <md-list-item>
      <img md-list-avatar [src]="repo.owner.avatar_url + '&s=40'" alt="{{repo.owner.login}} logo">
      <span md-line> {{repo.full_name}} </span>
    </md-list-item>
  `,
  providers: [],
  directives: [MD_LIST_DIRECTIVES],
  pipes: []
})
export class RepoSelectorRow {
  @Input('repo') repo:any;
}
