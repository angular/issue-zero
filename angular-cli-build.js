/* global require, module */

require('ts-node').register({
  project: '.'
});
var Angular2App = require('angular-cli/lib/broccoli/angular2-app');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var concat = require('broccoli-concat');
/**
 * TODO(jeffbcross): remove this hack when material alpha.3 lands
 * Temporary hack because material depends on global Event object,
 * which Node doesn't have.
 * Reported issue: https://github.com/angular/material2/issues/306
 * Fix: https://github.com/angular/material2/issues/307
 * Tracking issue: https://github.com/angular/issue-zero/issues/32
 */
global.Event = function () {};
const AppShellPlugin = require('./broccoli-app-shell.ts');
const ServiceWorkerPlugin = require('./broccoli-service-worker.ts');

module.exports = function(defaults) {
  var app = new Angular2App(defaults, {
    vendorNpmFiles: [
      'angularfire2/**/*.js',
      'firebase/lib/firebase-web.js',
      'rxjs/bundles/Rx.js',
      '@angular2-material/**/*.+(js|css|svg|map)',
      'material-design-icons/**/*.+(woff2|woff)',
      'angular2-service-worker/dist/worker.js',
      'hammerjs/hammer.min.js'
    ]
  });
  const ngTree = app.toTree();
  var swTree = new ServiceWorkerPlugin(ngTree);
  var appShellIndex = new AppShellPlugin(ngTree, 'index.html', 'app/issue-cli');
  var concatExtrasTree = new Funnel('src/client', {
    include: [
      'system.config.js',
      'auto-start.js'
    ]
  });
  var jsBundleTree = concat(mergeTrees([ngTree, concatExtrasTree]), {
    headerFiles: [
      // TODO: use minified for production build
      'vendor/hammerjs/hammer.min.js',
      'vendor/es6-shim/es6-shim.js',
      'vendor/systemjs/dist/system-polyfills.js',
      'vendor/angular2/bundles/angular2-polyfills.js',
      'vendor/systemjs/dist/system.src.js',
      'vendor/rxjs/bundles/Rx.js',
      'vendor/angular2/bundles/angular2.dev.js',
      'vendor/angular2/bundles/http.dev.js',
      'vendor/angular2/bundles/router.dev.js'
    ],
    inputFiles: ['system.config.js'],
    header: ';(function() {',
    footer: '}());',
    footerFiles: ['auto-start.js'],
    sourceMapConfig: { enabled: true },
    allowNone: false,
    outputFile: '/app-concat.js'
  });
  return mergeTrees([ngTree, appShellIndex, jsBundleTree, swTree], { overwrite: true })
};
