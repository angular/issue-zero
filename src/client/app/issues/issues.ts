declare var System;
import {Component} from 'angular2/core';
import {AsyncRoute, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {ListComponent} from './list/list';
import {CloseComponent} from './close/close';

@Component(
    {templateUrl : 'app/issues/issues.html', directives : ROUTER_DIRECTIVES})
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
export class IssuesComponent {
}
