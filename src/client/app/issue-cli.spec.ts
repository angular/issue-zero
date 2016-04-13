import {describe, it, expect, beforeEachProviders, inject} from 'angular2/testing';
import {IssueCliApp} from '../app/issue-cli';

beforeEachProviders(() => [IssueCliApp]);

describe('App: IssueCli', () => {
  it('should have the `defaultMeaning` as 42',
     inject(
         [IssueCliApp], (app: IssueCliApp) => {
                            // expect(app.defaultMeaning).toBe(42);
                        }));

  describe('#meaningOfLife', () => {
    it('should get the meaning of life',
       inject(
           [IssueCliApp], (app: IssueCliApp) => {
                              // expect(app.meaningOfLife()).toBe('The meaning of life is 42');
                              // expect(app.meaningOfLife(22)).toBe('The meaning of life is 22');
                          }));
  });
});
