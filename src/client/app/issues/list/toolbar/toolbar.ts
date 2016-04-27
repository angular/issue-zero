import {Component, EventEmitter, Input, Output} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';

@Component({
  selector: 'issue-list-toolbar',
  template: `
    <div *ngIf="repo">
      <md-toolbar>
        <img [src]="repo.owner.avatar_url + '&s=40'" alt="logo for {{repo.owner.login}}">
        {{repo.full_name}}
        <button class="change-repo" md-button [routerLink]="['/RepoSelector', {repo: repo.name, org: repo.owner.login}]">
          CHANGE
        </button>

        <span class="fill-remaining-space"></span>
        <i class="material-icons" [routerLink]="['/Issues', {org: repo.owner.login, repo: repo.name}, 'Filter']">
          filter_list
        </i>
      </md-toolbar>
    </div>
  `,
  styles: [`
    md-toolbar img {
      margin-right: 16px;
    }
    .fill-remaining-space {
      flex: 1 1 auto;
    }
    .change-repo {
      margin-left: 16px;
    }
  `],
  providers: [],
  directives: [MdButton, MdToolbar, ROUTER_DIRECTIVES],
  pipes: []
})
export class IssueListToolbar {
  @Input('repo') repo:any;
}
