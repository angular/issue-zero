import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { FilterStoreService } from './filter-store.service';

describe('FilterStore Service', () => {
  beforeEachProviders(() => [FilterStoreService]);

  it('should ...',
      inject([FilterStoreService], (service: FilterStoreService) => {
    expect(service).toBeTruthy();
  }));
});
