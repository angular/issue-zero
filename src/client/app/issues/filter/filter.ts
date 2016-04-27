import {Component} from 'angular2/core';
import {Location, ROUTER_DIRECTIVES} from 'angular2/router';
import {MdToolbar} from '@angular2-material/toolbar';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {Observable} from 'rxjs/Observable';

import {
  FilterStore,
  Filter as ServiceFilter,
  UnlabeledCriteria,
  LabelCriteria,
  Criteria
} from '../../filter-store.service';
import {Github} from '../../github/github';

@Component({
  template: `
    <md-toolbar>
      <a [routerLink]="['/Issues', {repo:repo, org:org}]">
        <i class="material-icons">
          arrow_back
        </i>
      </a>
      Untriaged Issue Filter
    </md-toolbar>
    <md-form>
      <md-card *ngFor="#criteria of (filter.changes | async)?.criteria; #criteriaIndex = index">
        <h3>{{criteria.name}}</h3>
        <div [ngSwitch]="criteria.type">
          <div *ngSwitchWhen="'hasLabel'">
            <select (change)="updateLabelCriteria(criteriaIndex, $event); foo='bar'">
              <option>
                Select Label
              </option>
              <option *ngFor="#label of labels; trackBy:labelTrack"
                [value]="label.name"
                [selected]="label.name === criteria.label">
                {{ label.name }}
              </option>
            </select>
          </div>
        </div>

        <a (click)="filter.removeCriteria(criteriaIndex)">
          <i class="material-icons">
            delete
          </i> Remove
        </a>
      </md-card>

      <label for="addCriteria">Add Additional Criteria</label>
      <select name="addCriteria" (change)="onChange($event)">
        <option>Apply more filters</option>
        <option *ngFor="#criteria of availableCriteria">
          {{criteria.name}}
        </option>
      </select>
    </md-form>
  `,
  styles: [`
    .fill-remaining-space {
      flex: 1 1 auto;
    }
  `],
  directives: [MdToolbar, MD_CARD_DIRECTIVES, ROUTER_DIRECTIVES],
  providers: [FilterStore, Github]
})
export class Filter {
  filter: ServiceFilter;
  labels: any[];
  org:string;
  repo:string;
  repoFull:string;
  availableCriteria:any[] = [LabelCriteria, UnlabeledCriteria];
  constructor(public location:Location, public filterStore:FilterStore, public gh:Github) {
    // TODO(jeffbcross): see if there's a better way to get params from parent routes
    var [path, org, repo] = /issues\/([a-zA-Z\+\-0-9]+)\/([a-zA-Z\+\-0-9]+)/.exec(location.path());
    this.org = org
    this.repo = repo
    this.repoFull = `${this.org}/${this.repo}`;
    this.filter = this.filterStore.getFilter(this.repoFull);
    gh.fetchLabels(this.repoFull)
      .take(1)
      .subscribe(labels => this.labels = labels);
  }

  fetchLabels():Observable<any[]> {
    return this.gh.fetchLabels(this.repoFull);
  }

  updateLabelCriteria(idx:number, evt:any) {
    this.filter.updateCriteria(idx, {
      type: 'hasLabel',
      name: 'Has label',
      label: evt.target.value,
      query: 'label:%s'
    });
  }

  onChange(evt) {
    this.filter.addCriteria(this.availableCriteria
      .filter((c:Criteria) => c.name === evt.target.value)[0]);

  }

  labelTrack(label:any): string {
    return label.type+label.label;
  }
}
