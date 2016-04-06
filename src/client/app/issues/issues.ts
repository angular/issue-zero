declare var System;
import {Component} from 'angular2/core';
import {AsyncRoute, RouteConfig, CanActivate, ROUTER_DIRECTIVES} from 'angular2/router';

import {FB_URL} from '../config';
import {ListComponent} from './list/list';
import {CloseComponent} from './close/close';

@Component({
  template : `
issues.html
<router-outlet></router-outlet>
      `,
  directives : ROUTER_DIRECTIVES
})
@RouteConfig([
  new AsyncRoute({
    path : '/close',
    name : 'IssueClose',
    loader :
        () =>
            System.import('app/issues/close/close').then(m => m.CloseComponent),
  }),
  {
    path : '/',
    name : 'IssueList',
    component : ListComponent,
    useAsDefault : true
  }
])
@CanActivate(() => !!(new Firebase(FB_URL)).getAuth())
export class IssuesComponent {
}
