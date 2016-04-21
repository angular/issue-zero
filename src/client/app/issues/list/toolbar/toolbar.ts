import {Component, EventEmitter, Input, Output} from 'angular2/core';
import {MdToolbar} from '@angular2-material/toolbar';

@Component({
  selector: 'issue-list-toolbar',
  template: `
    <div *ngIf="repo" [ngSwitch]="repoSelector">
      <md-toolbar color="accent" *ngSwitchWhen="true">
        <span>Select Repository</span>
        <i class="material-icons">
          arrow_drop_up
        </i>
      </md-toolbar>
      <md-toolbar *ngSwitchDefault>
        <img [src]="repo.owner.avatar_url + '&s=40'" alt="logo for {{repo.owner.login}}">
        <span>{{repo.full_name}}</span>
        <i class="material-icons">
          arrow_drop_down
        </i>
      </md-toolbar>
    </div>
  `,
  styles: [`
    md-toolbar {
      cursor: pointer;
    }
    md-toolbar img {
      margin-right: 16px;
    }
  `],
  providers: [],
  directives: [MdToolbar],
  pipes: []
})
export class IssueListToolbar {
  @Input('repo') repo:any;
  @Input('repoSelector') repoSelector:boolean;
}
