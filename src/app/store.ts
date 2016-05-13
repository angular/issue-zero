import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Issue, Repo, Label, User } from './shared/types';
import { FilterMap } from './filter-store.service';

export function issues (state: Issue[] = [], action:Action): Issue[] {
  switch (action.type) {
    case 'AddIssues':
      state = addIssues(action, state);
      break;
    case 'RemoveIssue':
      state = state.filter((issue:Issue) => {
        return issue.id !== action.payload.id;
      });
      break;
    case 'PendingRemoveIssue':
      state = state
        .map((issue:Issue) => {
          if (issue.id === action.payload.id) {
            return Object.assign({}, issue, {
              isPendingRemoval: true
            })
          }
          return issue;
        })
      break;
  }
  return state;
}

// Creates keys of org:repo:number to quickly filter against.
function getIssueUnique(issue:Issue): string {
  return `${issue.org}:${issue.repo}:${issue.number}`;
}

function addIssues(action:Action, state:Issue[]) {
  /**
   * Make sure no duplicate issues, newest issues win.
   **/
  var existingKeys = action.payload.reduce((prev, curr) => {
    prev[curr.id] = true;
    return prev;
  }, {});
  state = action.payload.concat(state.filter((issue:Issue) => {
    // Only return issues that aren't in the new payload.
    return !existingKeys[issue.id];
  }));
  return state;
}

export function repos(state: Repo[] = [], action:Action): Repo[] {
  switch(action.type) {
    case 'AddRepo':
      state = state.concat(action.payload);
      break;
  }
  return state;
}

export function users(state: User[] = [], action:Action): User[] {
  return state;
}

export function labels(state: Label[] = [], action:Action): Label[] {
  return state;
}

export function filters(state: FilterMap = {}, action:Action): FilterMap {
  switch(action.type) {
    case 'SetFilter':
      state = Object.assign({}, state, {
        [`${action.payload.org}/${action.payload.repo}`]: action.payload
      });
      break;
  }
  return state;
}

export interface AppState {
  issues: Issue[];
  labels: Label[];
  users: User[];
  repos: Repo[];
  filters: FilterMap;
}
