import {Component, Inject} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router} from '@angular/router-deprecated';
import {Location} from '@angular/common';
import {AngularFire, FirebaseAuthState} from 'angularfire2';
import { LoginComponent } from './+login';
import { IssuesComponent } from './+issues';
import { RepoSelectorComponent } from './+repo-selector';

import {MdButton} from '@angular2-material/button';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdIcon} from '@angular2-material/icon';
import {MdProgressCircle} from '@angular2-material/progress-circle';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MdToolbar} from '@angular2-material/toolbar';
import {Observable} from 'rxjs/Observable';
import {ArrayObservable} from 'rxjs/observable/ArrayObservable';
// import {Issues} from './issues/issues';
import {GithubService} from './github.service';
// import {RepoSelectorComponent} from './+repo-selector/index';
import { APP_SHELL_DIRECTIVES, IS_PRERENDER } from '@angular/app-shell';
import { IS_POST_LOGIN, Repo } from './shared';
import { MdIconRegistry } from '@angular2-material/icon';

@Component({
  moduleId: module.id,
  selector: 'issue-zero-app',
  styles: [`
md-toolbar[color=primary] {
  background: rgb(33, 150, 243)
}

md-sidenav {
  width: 200px;
  padding: 8px;
}

md-toolbar md-progress-circle[mode="indeterminate"] {
  width: 24px;
  height: 24px;
  margin: 0 8px;
}

md-toolbar md-progress-circle[mode="indeterminate"] /deep/ circle {
  stroke: white !important;
}

.indicator-container {
  height: 0;
  margin-top: 50%;
}

.indicator-container md-progress-circle {
  margin: -50px auto 0;
}
`],
  template: `
<md-sidenav-layout [ngClass]="{'preRendered': isPrerender}" fullscreen>
  <md-sidenav #sidenav>
    <div *shellNoRender>
      <md-card *ngIf="af.auth | async">
        <md-card-title-group>
          <img md-card-avatar [src]="(af.auth | async).github.profileImageURL + '&s=40'">
          <md-card-title>
            {{ (af.auth | async).github.displayName }}
          </md-card-title>
          <md-card-subtitle>
            @{{ (af.auth | async).github.username }}
          </md-card-subtitle>
        </md-card-title-group>
        <md-card-actions>
          <button md-button (click)="af.auth.logout(); sidenav.close()">
            Log out
          </button>
        </md-card-actions>
      </md-card>
      <md-card *ngIf="!(af.auth | async)">
        <md-card-title-group>
          <md-card-title>
            Not Logged In
          </md-card-title>
        </md-card-title-group>
        <md-card-actions>
          <button md-button (click)="af.auth.login()">
            Log in
          </button>
        </md-card-actions>
      </md-card>
    </div>
  </md-sidenav>
  <md-toolbar color="primary">
    <md-progress-circle mode="indeterminate" *shellRender></md-progress-circle>
    <button md-icon-button *shellNoRender (click)="sidenav.open()">
      <md-icon svgIcon="menu">menu</md-icon>
    </button>

    <span>Issue Zero</span>
  </md-toolbar>
  <div class="indicator-container" *shellRender>
    <md-progress-circle mode="indeterminate"></md-progress-circle>
  </div>

  <router-outlet *shellNoRender></router-outlet>
</md-sidenav-layout>
`,
  directives: [
    ROUTER_DIRECTIVES,
    MdToolbar, MD_CARD_DIRECTIVES, MD_SIDENAV_DIRECTIVES, MdButton,
    MdProgressCircle, APP_SHELL_DIRECTIVES, MdIcon
  ],
  pipes: [],
  providers: [MdIconRegistry]
})
@RouteConfig([
  { path: '/login', name: 'Login', component: LoginComponent },
  { path: '/issues/:org/:repo/...', name: 'Issues', component: IssuesComponent },
  { path: '/repo-selector', name: 'RepoSelector', component: RepoSelectorComponent }
])
export class IssueZeroAppComponent {
  constructor(
      @Inject(IS_PRERENDER) isPrerender: boolean,
      public af: AngularFire,
      public router: Router,
      @Inject(IS_POST_LOGIN) isPostLogin:boolean,
      location:Location,
      public gh:GithubService,
      mdIconRegistry:MdIconRegistry) {
        // Add navigation icons
        [['navigation', 'menu'], ['content', 'filter_list'], ['navigation', 'arrow_back'], ['action', 'delete']].forEach(([section,icon]) => {
          mdIconRegistry.addSvgIcon(icon, `/vendor/material-design-icons/${section}/svg/production/ic_${icon}_24px.svg`)
        });

      /**
       * Check login state and redirect to appropriate
       * page: Login or Issues route.
       */
      if (!isPrerender) {
        // If the page was part of the Firebase OAuth flow (the successful login redirect),
        // then short-circuit the auth observable.
        ArrayObservable.of(isPostLogin)
            .filter(v => v === true)
            .concat(af.auth)
            // Cast nulls to booleans
            .map(v => !!v)
            .distinctUntilChanged()
            .do((loggedIn: boolean) => {
              // If state is null (user not logged in) navigate to log in
              if (loggedIn && (!location.path() || location.path() === '/login')) {
                gh.fetch(`/user/repos`, 'affiliation=owner,collaborator&sort=updated')
                  .map((repos:Repo[]) => ({
                    org: repos[0].owner.login,
                    repo: repos[0].name
                  }))
                  .take(1)
                  .subscribe(config => router.navigate(['./Issues', config]));
              } else if (!isPostLogin) {
                router.navigate(['./Login']);
              }
            })
            // Only emit if user is logged in (state is non-null)
            .filter(state => !!state)
            // Complete this Observable after successful login
            .take(1)
            // onLogoutObervable takes over once user is logged in.
            // User will be redirected to login page whenever they log out.
            .concat(af.auth
                        // Keep this Observable alive for the duration of the app.
                        .do((state: FirebaseAuthState) => {
                          if (!state) {
                            router.navigate(['./Login'])
                          }
                        }))
            .subscribe();
      }
    }
}
