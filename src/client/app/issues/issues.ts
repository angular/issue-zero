import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from 'angular2/router';
import {List} from './list/list';
import {Filter} from './filter/filter';

@Component({
  providers: [],
  template: `<router-outlet></router-outlet>`,
  directives: [RouterOutlet]
})
@RouteConfig([
  {path: '/list', name: 'List', component: List, useAsDefault: true},
  {path: '/filter', name: 'Filter', component: Filter},
])
export class Issues {
  constructor() {}
}
