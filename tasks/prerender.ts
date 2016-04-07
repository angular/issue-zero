import 'angular2-universal-preview/polyfills';
import {prerender} from 'angular2-gulp-prerender';
import {REQUEST_URL, NODE_LOCATION_PROVIDERS} from 'angular2-universal-preview';
import {provide, enableProdMode} from 'angular2/core';
import {APP_BASE_HREF, ROUTER_PROVIDERS} from 'angular2/router';
import {defaultFirebase, FIREBASE_PROVIDERS} from 'angularfire2';
import {AppComponent} from '../src/client/app/app';
import {IS_PRERENDER} from '../src/client/app/config';

var gulp = require('gulp');

// Used for pre-rendering app-shell
enableProdMode();

export function prerenderTask (indexPath:string, dest:string) {
  return () => {
    return gulp.src(indexPath)
      .pipe(prerender({
        directives: [ AppComponent ],
        providers: [
          provide(APP_BASE_HREF, {useValue: '/'}),
          provide(REQUEST_URL, {useValue: '/'}),
          ROUTER_PROVIDERS,
          NODE_LOCATION_PROVIDERS,
          provide(IS_PRERENDER, {
            useValue: true
          }),
          FIREBASE_PROVIDERS,
          defaultFirebase('https://issue-zero.firebaseio.com')
        ],
        preboot: true
      }))
      .pipe(gulp.dest(dest));
  }
}