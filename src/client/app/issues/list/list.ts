import {Component, ChangeDetectionStrategy} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';

import {IssueListToolbar} from './toolbar/toolbar';
import {IssueRow} from './issue-row/issue-row';
import {RepoSelectorRow} from './repo-selector-row/repo-selector-row';

import {GithubObjects, Repo, User} from '../../github/types';
import {Github} from '../../github/github';

@Component({
  styles: [`
    md-list-item {
      background-color: rgb(245, 245, 245)
    }
  `],
  template: `
    <issue-list-toolbar
      (click)="toggleRepoSelector()"
      [repoSelector]="repoSelectorActive"
      [repo]="repoSelection | async">
    </issue-list-toolbar>

    <md-list *ngIf="!repoSelectorActive">
      <issue-row
        *ngFor="#issue of issues | async"
        [ngForTrackBy]="'url'"
        [issue]="issue">
      </issue-row>
    </md-list>

    <md-list *ngIf="repoSelectorActive">
      <repo-selector-row
        [repo]="repo"
        *ngFor="#repo of repos | async"
        (click)="repoSelection.next(repo); toggleRepoSelector()">
      </repo-selector-row>
    </md-list>
  `,
  providers: [Github],
  directives: [MD_LIST_DIRECTIVES, IssueListToolbar, IssueRow, RepoSelectorRow],
  pipes: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class List {
  issues: Observable<any[]>;
  repoSelectorActive:boolean = false;
  repos: Observable<Repo[]>;
  repoSelection: Subject<Repo>;
  constructor(gh:Github) {
    this.repos = gh.fetch(`/user/repos`, 'affiliation=owner,collaborator&sort=updated');

    this.repoSelection = new BehaviorSubject(null);
    this.repos
      .map((repos:Repo[]) => repos[0])
      .take(1)
      .subscribe(repo => this.repoSelection.next(repo));

    this.issues = this.repoSelection
      .filter(v => !!v)
      // Select the first repo, most-recently updated
      .switchMap((repo:Repo) => gh.fetch(`/repos/${repo.full_name}/issues`));
  }

  toggleRepoSelector() {
    this.repoSelectorActive = !this.repoSelectorActive;
  }

  getSmallAvatar(repo:Repo):string {
    return repo ? `${repo.owner.avatar_url}&s=40` : '';
  }
}
