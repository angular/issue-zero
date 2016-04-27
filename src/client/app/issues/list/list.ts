import {Component, ChangeDetectionStrategy, OnInit} from 'angular2/core';
import {Location, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';

import {IssueListToolbar} from './toolbar/toolbar';
import {IssueRow} from './issue-row/issue-row';
import {RepoSelectorRow} from './repo-selector-row/repo-selector-row';

import {GithubObjects, Repo, User} from '../../github/types';
import {Github} from '../../github/github';
import {FilterStore, Filter, FilterObject, generateQuery} from '../../filter-store.service';

@Component({
  styles: [`
    md-list-item {
      background-color: rgb(245, 245, 245)
    }
  `],
  template: `
    <issue-list-toolbar
      [repo]="repoSelection | async">
    </issue-list-toolbar>

    <md-list>
      <issue-row
        *ngFor="#issue of issues | async"
        [ngForTrackBy]="'url'"
        [issue]="issue">
      </issue-row>
    </md-list>
  `,
  providers: [Github, FilterStore],
  directives: [MD_LIST_DIRECTIVES, IssueListToolbar, IssueRow, ROUTER_DIRECTIVES],
  pipes: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class List implements OnInit {
  issues: Observable<Object[]>;
  repos: Observable<Repo[]>;
  repoSelection: Observable<Repo>;
  constructor(
    private gh: Github,
    private filterStore: FilterStore,
    private location: Location) {}

  ngOnInit () {
    // TODO(jeffbcross): see if there's a better way to get params from parent routes
    var [path, org, repo] = /issues\/([a-zA-Z\+\-0-9]+)\/([a-zA-Z\+\-0-9]+)/.exec(this.location.path());

    /**
     * Get full repo object based on route params.
     */
    this.repoSelection = this.gh.getRepo(`${org}/${repo}`);

    this.issues = this.filterStore.getFilter(`${org}/${repo}`).changes
      .map((filter:FilterObject) => generateQuery(filter))
      .switchMap((query:string) => {
        return this.gh.searchIssues(query)
      });
  }

  getSmallAvatar(repo:Repo):string {
    return repo ? `${repo.owner.avatar_url}&s=40` : '';
  }
}
