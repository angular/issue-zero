import {it, injectAsync, TestComponentBuilder} from 'angular2/testing';

import {AppComponent} from './app';

describe('AppComponent', () => {
  it('should say hello',
     injectAsync([ TestComponentBuilder ], (tcb: TestComponentBuilder) => {
       return tcb.createAsync(AppComponent).then(fixture => {
         expect(fixture.nativeElement.textContent).toBe('Hello!');
       });
     }));
});
