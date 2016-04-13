import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from 'angular2/router';
import {List} from './list/list';

@Component({
  providers: [],
  template: `Issues route`
})
@RouteConfig([
  {path: '/list/...', name: 'List', component: List, useAsDefault: true},
])
export class Issues {
  constructor() {}
}
