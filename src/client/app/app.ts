import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {MdToolbar} from '@angular2-material/toolbar';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdButton} from '@angular2-material/button';
import {AngularFire, FirebaseAuthState} from 'angularfire2';

import {IssuesComponent} from './issues/issues';
import {LoginComponent} from './login/login';

@Component({
  selector : 'issue-zero-app',
  styleUrls : ['app/app.css'],
  templateUrl : `/app/app.html`,
  directives :
      [ ROUTER_DIRECTIVES, MdToolbar, MD_CARD_DIRECTIVES, MD_SIDENAV_DIRECTIVES, MdButton ],
  providers : []
})
@RouteConfig(
    [ {
      path : 'issues/...',
      name: 'Issues',
      component : IssuesComponent
    },{
      path: 'login',
      name: 'Login',
      component: LoginComponent
    } ])
export class AppComponent {
  constructor(public af:AngularFire, router:Router) {
    /**
     * Check login state and redirect to appropriate
     * page: Login or Issues route.
     */
    af.auth
      .do((state:FirebaseAuthState) => {
        // If state is null (user not logged in) navigate to log in
        router.navigate([state ? './Issues' : './Login']);
      })
      // Only emit if user is logged in (state is non-null)
      .filter(state => state !== null)
      // Complete this Observable after successful login
      .take(1)
      // onLogoutObervable takes over once user is logged in.
      // User will be redirected to login page whenever they log out.
      .concat(af.auth
        // Keep this Observable alive for the duration of the app.
        .do((state:FirebaseAuthState) => {
          if (!state) {
            router.navigate(['./Login'])
          }
        }))
      .subscribe();
  }
}
