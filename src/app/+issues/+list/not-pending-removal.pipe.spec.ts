import {
  it,
  describe,
  expect,
  inject,
  beforeEachProviders
} from '@angular/core/testing';
import { NotPendingRemoval } from './not-pending-removal.pipe';

describe('NotPendingRemoval Pipe', () => {
  beforeEachProviders(() => [NotPendingRemoval]);

  it('should transform the input', inject([NotPendingRemoval], (pipe: NotPendingRemoval) => {
      // expect(pipe.transform(true)).toBe(null);
  }));
});
