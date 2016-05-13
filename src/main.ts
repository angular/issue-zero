import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { HTTP_PROVIDERS } from '@angular/http';
import { IssueZeroAppComponent, environment } from './app/';
import { APP_SHELL_RUNTIME_PROVIDERS } from '@angular/app-shell';
import {FIREBASE_PROVIDERS, defaultFirebase, AuthMethods, AuthProviders, firebaseAuthConfig} from 'angularfire2';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import {FB_URL, IS_POST_LOGIN, LOCAL_STORAGE} from './app/config';
import { GithubService } from './app/github.service';
import {provideStore} from '@ngrx/store';

// Import auto-patching RxJS operators
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/merge';

import {Issue} from './app/shared/types';
import {repos, issues, labels, users, filters} from './app/store';

if (environment.production) {
  enableProdMode();
}

// Checks if this is the OAuth redirect callback from Firebase
// Has to be global so can be used in CanActivate
(<any>window).__IS_POST_LOGIN = /\&__firebase_request_key/.test(window.location.hash);

bootstrap(IssueZeroAppComponent, [
  APP_SHELL_RUNTIME_PROVIDERS, FIREBASE_PROVIDERS, ROUTER_PROVIDERS, HTTP_PROVIDERS,
  defaultFirebase(FB_URL),
  provide(IS_POST_LOGIN, {
    useValue: (<any>window).__IS_POST_LOGIN
  }),
  GithubService,
  provideStore({repos:repos, issues:issues, labels:labels, users:users, filters:filters}),
  provide(LOCAL_STORAGE, {
    useValue: (<any>window.localStorage)
  }),
  firebaseAuthConfig(
      {provider: AuthProviders.Github, method: AuthMethods.Redirect, scope: ['repo']})
]);
