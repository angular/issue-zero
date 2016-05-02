import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from 'angular2/router';
import {List} from './list/list';
import {Filter} from './filter/filter';
import {Triage} from './triage/triage';

@Component({
  providers: [],
  template: `<router-outlet></router-outlet>`,
  directives: [RouterOutlet]
})
@RouteConfig([
  {path: '/list', name: 'List', component: List, useAsDefault: true},
  {path: '/filter', name: 'Filter', component: Filter},
  {path: '/triage/:number', name: 'Triage', component: Triage},
])
export class Issues {
  constructor() {}
}
