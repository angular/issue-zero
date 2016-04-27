import {Component, OnInit} from 'angular2/core';
import {Location, ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MdToolbar} from '@angular2-material/toolbar';
import {Observable} from 'rxjs/Observable';

import {RepoSelectorRow} from '../issues/list/repo-selector-row/repo-selector-row';
import {Github} from '../github/github';
import {Repo} from '../github/types';

@Component({
  selector: 'repo-selector',
  template: `
    <md-toolbar color="accent">
      <button [routerLink]="['/Issues', {repo: routeParams.get('repo'), org: routeParams.get('org')}]">
        <span class="material-icons back-btn">arrow_back</span>
      </button>
      <span>
        Select Repository
      </span>
    </md-toolbar>
    <md-list>
      <repo-selector-row
        [repo]="repo"
        *ngFor="#repo of repos | async"
        [routerLink]="['/Issues', {org: repo.owner.login, repo: repo.name}]">
      </repo-selector-row>
    </md-list>
  `,
  styles: [`
    md-toolbar button {
      color: white;
      background: transparent;
      outline: none;
      border: none;
    }
  `],
  directives: [MD_LIST_DIRECTIVES, MdToolbar, RepoSelectorRow, ROUTER_DIRECTIVES],
  providers: [Github]
})
export class RepoSelectorComponent implements OnInit {
  repos:Observable<Repo[]>;
  constructor(private gh:Github, private routeParams:RouteParams) {}

  ngOnInit() {
    this.repos = this.gh.fetch(`/user/repos`, 'affiliation=owner,collaborator&sort=updated');
  }
}
