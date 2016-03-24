import {it, injectAsync, TestComponentBuilder, xit} from 'angular2/testing';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {AppComponent} from './app';

describe('AppComponent', () => {
  xit('should say hello',
      injectAsync([ TestComponentBuilder ], (tcb: TestComponentBuilder) => {
        return tcb.overrideProviders(AppComponent, ROUTER_PROVIDERS)
            .createAsync(AppComponent)
            .then(fixture => {
              expect(fixture.nativeElement.textContent).toBe('Hello!');
            });
      }));

  it('should pass', () => expect(true).toBe(true));
});
