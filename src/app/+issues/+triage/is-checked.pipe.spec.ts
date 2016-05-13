import {
  it,
  describe,
  expect,
  inject,
  beforeEachProviders
} from '@angular/core/testing';
import { IsChecked } from './is-checked.pipe';

describe('IsChecked Pipe', () => {
  beforeEachProviders(() => [IsChecked]);

  it('should transform the input', inject([IsChecked], (pipe: IsChecked) => {
      // expect(pipe.transform(true)).toBe(null);
  }));
});
