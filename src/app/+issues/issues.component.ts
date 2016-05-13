import { Component } from '@angular/core';
import { ListComponent } from './+list';
import { RouteConfig , ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import { FilterComponent } from './+filter';
import { TriageComponent } from './+triage';

@Component({
  template: `<router-outlet></router-outlet>`,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  {path: '/list', name: 'List', component: ListComponent, useAsDefault: true},
  {path: '/filter', name: 'Filter', component: FilterComponent},
  {path: '/triage/:number', name: 'Triage', component: TriageComponent}
])
export class IssuesComponent {}
