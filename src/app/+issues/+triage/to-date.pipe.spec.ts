import {
  it,
  describe,
  expect,
  inject,
  beforeEachProviders
} from '@angular/core/testing';
import { ToDate } from './to-date.pipe';

describe('ToDate Pipe', () => {
  beforeEachProviders(() => [ToDate]);

  it('should transform the input', inject([ToDate], (pipe: ToDate) => {
      // expect(pipe.transform(true)).toBe(null);
  }));
});
