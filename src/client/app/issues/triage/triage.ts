import {Component, Pipe} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {MdButton} from '@angular2-material/button';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdCheckbox} from '@angular2-material/checkbox';
import {MdInput} from '@angular2-material/input';
import {MdCard} from '@angular2-material/card';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';

import {Github} from '../../github/github';
import {Issue, Label} from '../../github/types';
import {RepoParams} from '../../repo-params/repo-params';
import {AppState} from '../../store/store';

@Pipe({
  name: 'isChecked'
})
class IsChecked {
  transform (label: Label, [issue]: [Issue]): boolean {
    return issue ? issue.labels.filter(l => l.name === label.name).length === 1 : false;
  }
}

@Pipe({
  name: 'toDate'
})
class ToDate {
  transform(date:string): Date {
    return new Date(date);
  }
}

@Component({
  template: `
    <md-card *ngIf="issue">
      <md-card-title>
        {{issue?.title}}
        <span class="issue-number">
          #{{issue?.number}}
        </span>
      </md-card-title>
      <md-card-subtitle>
        @{{issue.user.login}} on {{issue.created_at | toDate | date}}:
      </md-card-subtitle>
      <md-card-content>
        {{issue?.body}}
      </md-card-content>
    </md-card>
    <md-card>
      <md-card-title>
        Triage
      </md-card-title>
      <md-card-content>
        <form>
          <md-input (change)="updateComment($event)" placeholder="Add Comment">

          </md-input>
          <h3>Labels</h3>
          <md-list dense>
            <md-list-item *ngFor="#label of labels | async">
              <md-checkbox (change)="labelChanged(label, $event)" [checked]="label | isChecked:issue">
                {{label.name}}
              </md-checkbox>
            </md-list-item>
          </md-list>
          <md-card-actions>
            <button md-button (click)="updateIssue()">
              Save
            </button>
            <button md-button color="warn" [routerLink]="['/Issues', {org: org, repo: repo}, 'List']">
              Cancel
            </button>
          </md-card-actions>
        </form>
      </md-card-content>
    </md-card>
  `,
  styles: [`
    .description {
      font-size: 1.2em;
    }
    md-card {
      margin: 16px 16px 0;
    }
    .issue-number {
      color: rgba(0,0,0,0.54);
    }
    .user-and-date {
      color: rgba(0,0,0,0.54);
    }
  `],
  providers: [RepoParams],
  directives: [MD_LIST_DIRECTIVES, MdButton, MdCheckbox, ROUTER_DIRECTIVES, MdToolbar, MdInput, MdCard],
  pipes: [IsChecked, ToDate]
})
export class Triage {
  comment: string;
  org: string;
  repo: string;
  labels: Observable<Label[]>;
  issue: Issue;
  labelsToApply: {[key:string]: boolean} = {};
  constructor(
    private repoParams: RepoParams,
    private gh: Github,
    private store: Store<AppState>,
    routeParams:RouteParams,
    private router:Router) {
    var {org, repo} = repoParams.getRepo();
    this.org = org;
    this.repo = repo;
    this.labels = gh.fetchLabels(`${org}/${repo}`);
    this.store.select('issues')
      .filter((i:Issue[]) => !!i)
      .map((issues:Issue[]) => issues
        .filter((issue:Issue) => {
          return issue.org === org && issue.repo === repo && issue.number === parseInt(routeParams.get('number'), 10)
        })[0]
      )
      .subscribe((issue:Issue) => {
        this.issue = issue;
      });
    this.gh.getIssue(org, repo, routeParams.get('number'))
      .subscribe((issue:Issue) => {
        this.store.dispatch({
          type: 'AddIssues',
          payload: [issue]
        });
      });
  }

  updateComment(val) {
    this.comment = val.target.value;
  }

  updateIssue() {
    var patch = {
      labels: Object.keys(this.labelsToApply)
    };

    var patchIssue = this.gh.patchIssue(this.org, this.repo, this.issue.number, patch);


    if (this.comment) {
      patchIssue = patchIssue.merge(this.gh.addComment(this.org, this.repo, this.issue.number, this.comment));
    }

    patchIssue.take(2).subscribe(null, null, () => {
      this.store.dispatch({
        type: 'RemoveIssue',
        payload: this.issue
      });
      this.router.navigate(['/Issues', {org: this.org, repo: this.repo}, 'List'])
    });
  }

  labelChanged (label: Label, value: boolean) {
    if (value) {
      this.labelsToApply[label.name] = value;
    } else {
      delete this.labelsToApply[label.name];
    }
  }
}
