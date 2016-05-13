import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { RepoParamsService } from './repo-params.service';

describe('RepoParams Service', () => {
  beforeEachProviders(() => [RepoParamsService]);

  it('should ...',
      inject([RepoParamsService], (service: RepoParamsService) => {
    expect(service).toBeTruthy();
  }));
});
