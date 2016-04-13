import {Component, Inject} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router} from 'angular2/router';
import {AngularFire, FirebaseAuthState} from 'angularfire2';
import {MdToolbar} from '@angular2-material/toolbar';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MdButton} from '@angular2-material/button';
import {MdProgressCircle} from '@angular2-material/progress-circle';
import {Observable} from 'rxjs';
import {Issues} from './issues/issues';
import {Login} from './login/login';
import {IS_PRERENDER, IS_POST_LOGIN} from './config';


@Component({
  selector: 'issue-cli-app',
  styles: [`
md-toolbar button {
  color: white;
  background: transparent;
  outline: none;
  border: none;
}
md-sidenav-layout {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
md-sidenav {
  width: 200px;
  padding: 8px;
}

md-toolbar md-progress-circle[mode="indeterminate"] {
  width: 24px;
  height: 24px;
  margin: 0 6px;
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
<md-sidenav-layout [ngClass]="{'preRendered': isPrerender}">
  <md-sidenav #sidenav>
    <div *ngIf="!isPrerender">
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
    <md-progress-circle mode="indeterminate" *ngIf="isPrerender"></md-progress-circle>
    <button *ngIf="!isPrerender" (click)="sidenav.open()"><i class="material-icons">menu</i></button>

    <span>Issue Zero</span>
  </md-toolbar>
  <div class="indicator-container" *ngIf="isPrerender">
    <md-progress-circle mode="indeterminate"></md-progress-circle>
  </div>

  <router-outlet *ngIf="!isPrerender"></router-outlet>
</md-sidenav-layout>
`,
  directives: [
    ROUTER_DIRECTIVES, MdToolbar, MD_CARD_DIRECTIVES, MD_SIDENAV_DIRECTIVES, MdButton,
    MdProgressCircle
  ],
  pipes: []
})
@RouteConfig([
  {path: '/issues/...', name: 'Issues', component: Issues},
  {path: '/login', name: 'Login', component: Login},
])
export class IssueCliApp {
  constructor(
      public af: AngularFire, router: Router, @Inject(IS_PRERENDER) public isPrerender: boolean, @Inject(IS_POST_LOGIN) isPostLogin:boolean) {
    /**
     * Check login state and redirect to appropriate
     * page: Login or Issues route.
     */
    if (!isPrerender) {
      // If the page was part of the Firebase OAuth flow (the successful login redirect),
      // then short-circuit the auth observable.
      Observable.of(isPostLogin)
          .filter(v => v === true)
          .concat(af.auth)
          // Cast nulls to booleans
          .map(v => !!v)
          .distinctUntilChanged()
          .do((loggedIn: boolean) => {
            console.log('navigating to ', loggedIn)
            // If state is null (user not logged in) navigate to log in
            if (loggedIn) {
              router.navigate(['./Issues']);
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
