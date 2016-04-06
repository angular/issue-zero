declare var preboot;
import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, APP_BASE_HREF} from 'angular2/router';
import {FIREBASE_PROVIDERS, defaultFirebase, AuthMethods, AuthProviders, firebaseAuthConfig} from 'angularfire2';

import {AppComponent} from './app';
import {FB_URL, IS_PRERENDER} from './config';

// Import auto-patching RxJS operators
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/concat';

bootstrap(AppComponent, [
  FIREBASE_PROVIDERS, ROUTER_PROVIDERS, defaultFirebase(FB_URL),
  provide(IS_PRERENDER, {useValue : false}), firebaseAuthConfig({
    provider : AuthProviders.Github,
    method : AuthMethods.Redirect,
    scope : [ 'repo' ]
  })
]).then(() => {
  if (typeof preboot !== 'undefined')
    preboot.complete();
  if (typeof performance !== 'undefined' && performance.timing &&
      performance.timing.navigationStart) {
    performance.mark('bootstrapped');
    console.log('total time to bootstrap',
                Date.now() - performance.timing.navigationStart);
  }
});
