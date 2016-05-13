import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { GithubService } from './github.service';

describe('Github Service', () => {
  beforeEachProviders(() => [GithubService]);

  it('should ...',
      inject([GithubService], (service: GithubService) => {
    expect(service).toBeTruthy();
  }));
});
