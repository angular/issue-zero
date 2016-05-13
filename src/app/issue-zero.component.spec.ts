import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { IssueZeroAppComponent } from '../app/issue-zero.component';

beforeEachProviders(() => [IssueZeroAppComponent]);

describe('App: IssueZero', () => {
  it('should create the app',
      inject([IssueZeroAppComponent], (app: IssueZeroAppComponent) => {
    expect(app).toBeTruthy();
  }));
});
