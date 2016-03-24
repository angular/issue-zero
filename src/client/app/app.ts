import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {IssuesComponent} from './issues/issues';

@Component({
  selector : 'issue-zero-app',
  template : `
    <h1>Hello!</h1>
    <router-outlet></router-outlet>
  `,
  directives : ROUTER_DIRECTIVES,
  providers : []
})
@RouteConfig(
    [ {path : 'issues/...', component : IssuesComponent, useAsDefault : true} ])
export class AppComponent {
}
