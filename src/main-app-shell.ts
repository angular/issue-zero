import {provide} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {
  REQUEST_URL,
  ORIGIN_URL,
  NODE_ROUTER_PROVIDERS,
  NODE_LOCATION_PROVIDERS,
  NODE_HTTP_PROVIDERS
} from 'angular2-universal';
import { APP_SHELL_BUILD_PROVIDERS } from '@angular/app-shell';
import { AngularFire, FIREBASE_PROVIDERS, defaultFirebase } from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty';

import {FB_URL, IS_POST_LOGIN, LOCAL_STORAGE} from './app/shared/config';
import {IssueZeroAppComponent} from './app/';
import { GithubService } from './app/github.service';

export const options = {
  directives: [
    // The component that will become the main App Shell
    IssueZeroAppComponent
  ],
  platformProviders: [
    NODE_ROUTER_PROVIDERS,
    NODE_LOCATION_PROVIDERS,
    provide(ORIGIN_URL, {
      useValue: ''
    })
  ],
  providers: [
    APP_SHELL_BUILD_PROVIDERS,
    FIREBASE_PROVIDERS,
    defaultFirebase(FB_URL),
    provide(AngularFire, {
      useValue: {
        auth: Observable.empty()
      }
    }),
    provide(IS_POST_LOGIN, {
      useValue: false
    }),
    // What URL should Angular be treating the app as if navigating
    provide(APP_BASE_HREF, {useValue: '/'}),
    provide(REQUEST_URL, {useValue: '/'}),
    NODE_HTTP_PROVIDERS,
    GithubService,
    provide(LOCAL_STORAGE, {
      useValue: {
        getItem: () => null,
        setItem: () => null
      }
    })
  ]
};

