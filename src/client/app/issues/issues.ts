import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {ListComponent} from './list/list';
import {CloseComponent} from './close/close';

@Component({
  templateUrl : 'app/issues/issues.html',
  directives: ROUTER_DIRECTIVES
})
@RouteConfig([{
  path: 'close',
  name: 'IssueClose',
  component: CloseComponent,
},{
  path: '/',
  name: 'IssueList',
  component: ListComponent,
  useAsDefault: true
}])
export class IssuesComponent {
}
