/// <reference path="typings/main/ambient/node/index.d.ts" />

/**
 * TODO(jeffbcross): remove this when a better solution is found
 * This hack is necessary for universal precompilation to work with
 * material components that reference `Event`.
 */
(<any>global).Event = function () {
  console.log('constructing event');
  return {};
};
import 'angular2-universal-preview/polyfills';
import {REQUEST_URL, NODE_LOCATION_PROVIDERS} from 'angular2-universal-preview';
import {provide, enableProdMode} from 'angular2/core';
import {APP_BASE_HREF, ROUTER_PROVIDERS} from 'angular2/router';
import {prerender} from 'angular2-gulp-prerender';
import {defaultFirebase, FIREBASE_PROVIDERS} from 'angularfire2';

import {AppComponent} from './src/client/app/app';
import {IS_PRERENDER} from './src/client/app/config';

var gulp = require('gulp');
var ts = require('gulp-typescript');
var fs = require('fs');
var fse = require('fs-extra');
var runSequence = require('run-sequence');
var Builder = require('systemjs-builder');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

const clientTsProject = ts.createProject('src/client/tsconfig.json', {
  typescript: require('typescript'),
});

const systemCfg = JSON.parse(fse.readFileSync('system.config.json'));

const CLIENT_ROOT = 'src/client';
const DIST_CLIENT_ROOT = 'dist/client';
const TMP_CLIENT_ROOT = 'tmp/client';

const clientTsTree = [`${CLIENT_ROOT}/app/**/*.ts`, 'typings/browser/browser.d.ts'];
const clientVendorDeps = [
  'node_modules/angular2/**/*.js',
  'node_modules/angularfire2/**/*.js',
  'node_modules/firebase/**/*.js',
  'node_modules/systemjs/**/*.+(js|map)',
  'node_modules/rxjs/**/*.+(js|map)',
  'node_modules/zone.js/dist/*.js',
  'node_modules/reflect-metadata/Reflect.+(js|map)',
  'node_modules/@angular2-material/**/*.+(js|css|html|map)',
  'node_modules/material-design-icons/**/*.+(css|svg|woff|ttf|eot|woff2)'
];
const clientHtmlTree = [`${CLIENT_ROOT}/**/*.html`];
const clientCssTree = [`${CLIENT_ROOT}/**/*.css`];

// Used for pre-rendering app-shell
enableProdMode();

gulp.task('prerender', () => {
  return gulp.src('./src/client/index.html')
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
    .pipe(gulp.dest('dist/client'));
});


gulp.task('clean', (done) => {
  return fse.remove('dist', done);
});

gulp.task('bundle:client', ['build:client'], (done) => {
  let builder = new Builder();
  builder.config(systemCfg);
  builder.bundle('tmp/client/app/index.js', 'dist/client/app.js')
    .then(() => done());
});

gulp.task('concat', () => {
  return gulp.src([
    'node_modules/angular2/bundles/angular2-polyfills.js',
    'node_modules/systemjs/dist/system.js',
    'dist/client/app.js',
    'src/client/loader.js'
    ])
    .pipe(concat('app-concat.js'))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(gulp.dest('./dist/client'));
});

gulp.task('build:client', ['clean'], (callback) => {
  runSequence(
    [
      'build:client/typescript',
      'copy:client'
    ],
    callback);
});

gulp.task('copy:client', [
  'copy:client/html',
  'copy:client/css',
  'copy:client/firebase',
  'copy:client/vendor/src',
  'copy:client/vendor/mdfont'
]);

gulp.task('copy:client/vendor/src', () => gulp
  .src([
    'node_modules/zone.js/dist/long-stack-trace-zone.js',
    'node_modules/systemjs/dist/system.js',
    'node_modules/angular2/bundles/angular2-polyfills.js'
  ])
  .pipe(gulp.dest(`${DIST_CLIENT_ROOT}/vendor`)))

gulp.task('copy:client/vendor/mdfont', () => gulp
  .src([
    'node_modules/material-design-icons/iconfont/**/*'
  ], {base: 'node_modules'})
  .pipe(gulp.dest(`${DIST_CLIENT_ROOT}/vendor`)));

gulp.task('copy:client/firebase', () => {
  return gulp.src(`${CLIENT_ROOT}/firebase.json`)
      .pipe(gulp.dest(DIST_CLIENT_ROOT));
});


gulp.task('copy:client/html', () => {
  return gulp.src(clientHtmlTree)
    .pipe(gulp.dest(DIST_CLIENT_ROOT));
});


gulp.task('build:client/typescript', () => {
  return gulp.src(clientTsTree.concat('typings/browser/ambient/**/*.ts'))
    .pipe(ts(clientTsProject))
    .pipe(gulp.dest(`${TMP_CLIENT_ROOT}/app`))
});


gulp.task('copy:client/css', () => {
  return gulp.src(clientCssTree)
    .pipe(gulp.dest(DIST_CLIENT_ROOT));
});


gulp.task('enforce-format', function() {
  return doCheckFormat().on('warning', function(e) {
    console.log("ERROR: You forgot to run clang-format on your change.");
    console.log("See https://github.com/angular/angular/blob/master/DEVELOPER.md#clang-format");
    process.exit(1);
  });
});

gulp.task('lint', function() {
  var tslint = require('gulp-tslint');
  // Built-in rules are at
  // https://github.com/palantir/tslint#supported-rules
  var tslintConfig = {
    "rules": {
      "requireInternalWithUnderscore": true,
      "requireParameterType": true,
      "requireReturnType": true,
      "semicolon": true,
      "variable-name": false
    }
  };
  return gulp.src(clientTsTree)
      .pipe(tslint({
        tslint: require('tslint').default,
        configuration: tslintConfig,
        rulesDirectory: 'tools/tslint'
      }))
      .pipe(tslint.report('prose', {emitError: true}));
});

gulp.task('default', [
  'bundle:client', 'prerender'], (callback) => {
    runSequence(['concat'], callback);
});

function doCheckFormat() {
  var clangFormat = require('clang-format');
  var gulpFormat = require('gulp-clang-format');

  return gulp.src(`${CLIENT_ROOT}/**/*.ts`)
      .pipe(gulpFormat.checkFormat('file', clangFormat));
}
