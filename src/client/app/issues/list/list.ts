import {Component, ChangeDetectionStrategy, OnInit, Pipe, PipeTransform} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {Store} from '@ngrx/store';

import {IssueListToolbar} from './toolbar/toolbar';
import {IssueRow} from './issue-row/issue-row';
import {RepoSelectorRow} from './repo-selector-row/repo-selector-row';

import {GithubObjects, Repo, User} from '../../github/types';
import {Github} from '../../github/github';
import {Issue} from '../../github/types';
import {FilterStore, Filter, FilterObject, FilterMap, generateQuery} from '../../filter-store.service';
import {RepoParams} from '../../repo-params/repo-params';

import {AppState} from '../../store/store';


@Pipe({
  name: 'notRemoved'
})
export class NotPendingRemoval implements PipeTransform {
  transform (issues:Issue[]): Issue[] {
    if (!issues) return issues;
    return issues.filter((issue:Issue) => !issue.isPendingRemoval)
  }
}

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
        *ngFor="#issue of issues | async | notRemoved"
        [ngForTrackBy]="'url'"
        [issue]="issue"
        (close)="closeIssue(issue)"
        (triage)="triageIssue(issue)"
        [routerLink]="['../Triage', {number: issue.number}]">
      </issue-row>
    </md-list>
  `,
  providers: [Github, FilterStore, RepoParams],
  directives: [MD_LIST_DIRECTIVES, IssueListToolbar, IssueRow, ROUTER_DIRECTIVES],
  pipes: [NotPendingRemoval],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class List implements OnInit {
  issues: Observable<Issue[]>;
  repos: Observable<Repo[]>;
  repoSelection: Observable<Repo>;
  addIssueSubscription:Subscription;
  constructor(
    private gh: Github,
    private filterStore: FilterStore,
    private store:Store<AppState>,
    private repoParams:RepoParams,
    private router:Router) {}

  ngOnInit () {
    var {repo, org} = this.repoParams.getRepo();

    /**
     * Get full repo object based on route params.
     */
    this.repoSelection = this.store.select('repos')
      .filter((r:Repo) => !!r)
      .map((repos:Repo[]) => repos
        .filter((repository:Repo) => {
          return repository.name === repo && repository.owner.login === org;
        })[0]);

    this.gh.getRepo(`${org}/${repo}`).subscribe((repo:Repo) => {
      this.store.dispatch({
        type: 'AddRepo',
        payload: repo
      });
    })

    /**
     * Fetch the issues for this repo.
     */
    this.addIssueSubscription = this.store
      .select('filters')
      .map((filters:FilterMap) => filters && filters[`${org}/${repo}`])
      .filter((filter: Filter) => !!filter)
      .flatMap((filter: Filter) => filter.changes)
      .map((filter:FilterObject) => generateQuery(filter))
      .switchMap((query:string) => this.gh.getIssues(query))
      .subscribe((issues: Issue[]) => {
        this.store.dispatch({
          type: 'AddIssues',
          payload: issues
        })
      });

    this.store.dispatch({
      type: 'SetFilter',
      payload: this.filterStore.getFilter(`${org}/${repo}`)
    });

    this.issues = this.store.select('issues')
      .filter((i:Issue[]) => !!i)
      .map((issues:Issue[]) => issues
        .filter((issue:Issue) => {
          return issue.org === org && issue.repo === repo
        })
      );
  }

  getSmallAvatar(repo:Repo):string {
    return repo ? `${repo.owner.avatar_url}&s=40` : '';
  }

  ngOnDestroy() {
    if (this.addIssueSubscription) this.addIssueSubscription.unsubscribe();
  }

  closeIssue(issue: Issue): void {
    // Set the issue as pending removal
    this.store.dispatch({
      type: 'PendingRemoveIssue',
      payload: issue
    });
    this.gh.closeIssue(issue)
      .take(1)
      .subscribe(() => {
        this.store.dispatch({
          type: 'RemoveIssue',
          payload: issue
        });
      });
  }

  triageIssue(issue: Issue) {
    this.router.navigate(['../Triage', {number: issue.number}])
  }
}
