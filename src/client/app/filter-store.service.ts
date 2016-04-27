import {Inject, Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import {Operator} from 'rxjs/Operator';

import {LOCAL_STORAGE} from './config';

export const LOCAL_STORAGE_KEY = 'FilterStore.filters';

@Injectable()
export class FilterStore {
  private _filters = new Map<string, Filter>();
  constructor(@Inject(LOCAL_STORAGE) private localStorage:any) {}

  getFilter (repository:string): Filter {
    var filter = this._filters.get(repository);
    if (filter) {
      return filter;
    } else {
      var newFilter = retrieveFromCache(repository, this.localStorage);
      if (!newFilter) {
        newFilter = new Filter(this.localStorage, repository);
        updateCache(repository, newFilter.changes.value, this.localStorage);
      }
      this._filters.set(repository, newFilter);
      return newFilter;
    }
  }
}

export function updateCache(repo:string, filter:FilterObject, storage:any): void {
  storage.setItem(`${LOCAL_STORAGE_KEY}:${repo}`, JSON.stringify(filter));
}

export function retrieveFromCache(repo:string, storage:any): Filter {
  var filterCached = storage.getItem(`${LOCAL_STORAGE_KEY}:${repo}`);
  return filterCached ? Filter.fromJson(storage, JSON.parse(filterCached)) : null;
}

export class Filter {
  changes: BehaviorSubject<FilterObject>;
  constructor(private localStorage:any, repo?:string, criteria: Criteria[] = [UnlabeledCriteria]) {
    this.changes = new BehaviorSubject({
      repo,
      criteria
    });
  }

  updateCriteria(index:number, newCriteria:Criteria | LabelCriteria): void {
    var initialValue = this.changes.value;
    var newValue = {
      repo: initialValue.repo,
      criteria: initialValue.criteria.map((oldCriteria:Criteria, i:number) => {
        return i === index ? newCriteria : oldCriteria;
      })
    };
    this._cacheAndEmit(newValue);
  }

  addCriteria(c:Criteria): void {
    var initialValue = this.changes.value;
    var newValue = {
      repo: initialValue.repo,
      criteria: initialValue.criteria.concat([c])
    };
    switch(c.type) {
      case 'unlabeled':
        newValue.criteria = removeHasLabelCriteria(newValue.criteria);
        break;
      case 'hasLabel':
        newValue.criteria = removeNoLabelIfHasLabel(newValue.criteria);
        break;
    }
    this._cacheAndEmit(newValue);
  }

  removeCriteria(index:number): void {
    var initialValue = this.changes.value;
    var newValue = {
      repo: initialValue.repo,
      criteria: initialValue.criteria.reduce((prev:Criteria[], curr:Criteria, i) => {
          if (i === index) return prev;
          return prev.concat([curr]);
        }, [])
    };
    this._cacheAndEmit(newValue);
  }

  _cacheAndEmit(newValue:FilterObject): void {
    updateCache(newValue.repo, newValue, this.localStorage);
    this.changes.next(newValue);
  }

  setStorage(localStorage: any): void {
    this.localStorage = localStorage;
  }

  static fromJson (storage:any, json:FilterObject):Filter {
    return new Filter(storage, json.repo, json.criteria);
  }
}

/**
 * Prevents the presence of a hasLabel and unlabeled type of criteria,
 * which are incompatible.
 */
export function removeNoLabelIfHasLabel(criteria:Criteria[]): Criteria[] {
  var hasLabelInList = !!criteria.filter((c:Criteria) => c.type === 'hasLabel').length;
  // No hasLabel type in list, return as-is.
  if (!hasLabelInList) return criteria;
  if (hasLabelInList) {
    return criteria.reduce((prev, curr:Criteria) => {
      if (curr.type === 'unlabeled') return prev;
      prev.push(curr)
      return prev;
    }, []);
  }
}

export function removeHasLabelCriteria(criteria: Criteria[]): Criteria[] {
  var hasUnlabeledInList = !!criteria.filter((c:Criteria) => c.type === 'unlabeled').length;
  // No hasLabel type in list, return as-is.
  if (!hasUnlabeledInList) return criteria;
  if (hasUnlabeledInList) {
    return criteria.reduce((prev, curr:Criteria) => {
      if (curr.type === 'hasLabel') return prev;
      prev.push(curr)
      return prev;
    }, []);
  }
}

export function generateQuery (filter:FilterObject): string {
  var generated = `${filter.criteria
    .map(c => {
      var interpolated = c.query;
      if ((<LabelCriteria>c).label) {
        let label = (<LabelCriteria>c).label;
        // Replace spaces with pluses to make Github API happy
        label = label.replace(/ /g, '+')
        // Wrap in quotes for more complex labels
        label = `"${label}"`
        interpolated = c.query.replace('%s', label)
      }

      // URI encode it
      interpolated = encodeURI(interpolated);
      // Unescape quotes
      return interpolated.replace(/%22/g, '"');
    })
    .join('+')}+repo:${filter.repo}+state:open`
  return generated;
}

export interface FilterObject {
  criteria: Criteria[];
  repo: string;
}

export interface Criteria {
  type: string;
  name: string;
  query: string;
}

export interface LabelCriteria extends Criteria {
  label?: string;
}

export const UnlabeledCriteria:Criteria = {
  type: 'unlabeled',
  name: 'Has NO label',
  query: 'no:label'
};

export const LabelCriteria = {
  type: 'hasLabel',
  name: 'Has label',
  query: 'label:%s'
}
