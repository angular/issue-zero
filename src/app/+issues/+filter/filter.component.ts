import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {MdToolbar} from '@angular2-material/toolbar';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdIcon} from '@angular2-material/icon';
import { MdAnchor, MdButton } from '@angular2-material/button';
import {Observable} from 'rxjs/Observable';

import {
  FilterStoreService,
  Filter as ServiceFilter,
  UnlabeledCriteria,
  LabelCriteria,
  Criteria
} from '../../filter-store.service';
import {GithubService} from '../../github.service';
import {RepoParamsService} from '../../repo-params.service';

@Component({
  template: `
    <md-toolbar>
      <button md-icon-button [routerLink]="['/Issues', {repo:repo, org:org}]" class="back-link">
        <md-icon svgIcon="arrow_back">
          back
        </md-icon>
      </button>
      Untriaged Issue Filter
    </md-toolbar>
    <md-form>
      <md-card *ngFor="let criteria of (filter.changes | async)?.criteria; #criteriaIndex = index">
        <h3>{{criteria.name}}</h3>
        <div [ngSwitch]="criteria.type">
          <div *ngSwitchWhen="'hasLabel'">
            <select (change)="updateLabelCriteria(criteriaIndex, $event); foo='bar'">
              <option>
                Select Label
              </option>
              <option *ngFor="let label of labels; trackBy:labelTrack"
                [value]="label.name"
                [selected]="label.name === criteria.label">
                {{ label.name }}
              </option>
            </select>
          </div>
        </div>

        <button md-icon-button (click)="filter.removeCriteria(criteriaIndex)">
          <md-icon svgIcon="delete">
            delete
          </md-icon> Remove
        </button>
      </md-card>

      <label for="addCriteria">Add Additional Criteria</label>
      <select name="addCriteria" (change)="onChange($event)">
        <option>Apply more filters</option>
        <option *ngFor="let criteria of availableCriteria">
          {{criteria.name}}
        </option>
      </select>
    </md-form>
  `,
  styles: [`
    .fill-remaining-space {
      flex: 1 1 auto;
    }
    .back-link {
      color: rgba(0, 0, 0, 0.870588)
    }
  `],
  directives: [MdIcon, MdToolbar, MD_CARD_DIRECTIVES, ROUTER_DIRECTIVES, MdAnchor, MdButton],
  providers: [FilterStoreService, GithubService, RepoParamsService]
})
export class FilterComponent {
  filter: ServiceFilter;
  labels: any[];
  org: string;
  repo: string;
  repoFull: string;
  availableCriteria: any[] = [LabelCriteria, UnlabeledCriteria];
  constructor(
    public filterStore: FilterStoreService,
    public gh: GithubService,
    private repoParams: RepoParamsService) {
    var {org, repo} = repoParams.getRepo();
    this.org = org;
    this.repo = repo;
    this.repoFull = `${this.org}/${this.repo}`;
    this.filter = this.filterStore.getFilter(this.repoFull);
    gh.fetchLabels(this.repoFull)
      .take(1)
      .subscribe(labels => this.labels = labels);
  }

  fetchLabels(): Observable<any[]> {
    return this.gh.fetchLabels(this.repoFull);
  }

  updateLabelCriteria(idx: number, evt: any) {
    this.filter.updateCriteria(idx, {
      type: 'hasLabel',
      name: 'Has label',
      label: evt.target.value,
      query: 'label:%s'
    });
  }

  onChange(evt) {
    this.filter.addCriteria(this.availableCriteria
      .filter((c: Criteria) => c.name === evt.target.value)[0]);

  }

  labelTrack(label: any): string {
    return label.type + label.label;
  }
}
