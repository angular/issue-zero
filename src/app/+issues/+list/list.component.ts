import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {Store} from '@ngrx/store';

import {ToolbarComponent} from './toolbar/toolbar.component';
import {IssueRowComponent} from './issue-row/issue-row.component';
import {Repo} from '../../shared/types';
import {GithubService} from '../../github.service';
import {Issue} from '../../shared/types';
import {
  FilterStoreService,
  Filter,
  FilterObject,
  FilterMap,
  generateQuery
} from '../../filter-store.service';
import {RepoParamsService} from '../../repo-params.service';
import {AppState} from '../../store';
import {NotPendingRemoval} from './not-pending-removal.pipe';

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
        *ngFor="let issue of issues | async | notPendingRemoval"
        [ngForTrackBy]="'url'"
        [issue]="issue"
        (close)="closeIssue(issue)"
        (triage)="triageIssue(issue)"
        [routerLink]="['../Triage', {number: issue.number}]">
      </issue-row>
    </md-list>
  `,
  providers: [GithubService, FilterStoreService, RepoParamsService],
  directives: [MD_LIST_DIRECTIVES, ToolbarComponent, IssueRowComponent, ROUTER_DIRECTIVES],
  pipes: [NotPendingRemoval],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  issues: Observable<Issue[]>;
  repos: Observable<Repo[]>;
  repoSelection: Observable<Repo>;
  addIssueSubscription: Subscription;
  constructor(
      private gh: GithubService, private filterStore: FilterStoreService,
      private store: Store<AppState>, private repoParams: RepoParamsService,
      private router: Router) {}

  ngOnInit() {
    var {repo, org} = this.repoParams.getRepo();

    /**
     * Get full repo object based on route params.
     */
    this.repoSelection = this.store.select('repos')
                             .filter((r: Repo) => !!r)
                             .map((repos: Repo[]) => repos.filter((repository: Repo) => {
                               return repository.name === repo && repository.owner.login === org;
                             })[0]);

    this.gh.getRepo(`${org}/${repo}`).subscribe((_repo: Repo) => {
      this.store.dispatch({type: 'AddRepo', payload: _repo});
    });

    /**
     * Fetch the issues for this repo.
     */
    this.addIssueSubscription =
        this.store.select('filters')
            .map((filters: FilterMap) => filters && filters[`${org}/${repo}`])
            .filter((filter: Filter) => !!filter)
            .flatMap((filter: Filter) => filter.changes)
            .map((filter: FilterObject) => generateQuery(filter))
            .switchMap((query: string) => this.gh.getIssues(query))
            .subscribe(
                (issues: Issue[]) => {this.store.dispatch({type: 'AddIssues', payload: issues});});

    this.store.dispatch({type: 'SetFilter', payload: this.filterStore.getFilter(`${org}/${repo}`)});

    this.issues = this.store.select('issues')
                      .filter((i: Issue[]) => !!i)
                      .map(
                          (issues: Issue[]) => issues.filter(
                              (issue: Issue) => {return issue.org === org && issue.repo === repo;}));
  }

  getSmallAvatar(repo: Repo): string { return repo ? `${repo.owner.avatar_url}&s=40` : ''; }

  ngOnDestroy() {
    if (this.addIssueSubscription) {
      this.addIssueSubscription.unsubscribe();
    }
  }

  closeIssue(issue: Issue): void {
    // Set the issue as pending removal
    this.store.dispatch({type: 'PendingRemoveIssue', payload: issue});
    this.gh.closeIssue(issue).take(1).subscribe(
        () => { this.store.dispatch({type: 'RemoveIssue', payload: issue}); });
  }

  triageIssue(issue: Issue) { this.router.navigate(['../Triage', {number: issue.number}]); }
}
