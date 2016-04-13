/* global require, module */

require('ts-node').register({
  project: '.'
});
var Angular2App = require('angular-cli/lib/broccoli/angular2-app');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var concat = require('broccoli-concat');
// Hack because material depends on global Event object, which Node doesn't have.
global.Event = function () {};
const AppShellPlugin = require('./broccoli-app-shell.ts');

module.exports = function(defaults) {
  var app = new Angular2App(defaults, {
    vendorNpmFiles: [
      'angularfire2/**/*.js',
      'firebase/lib/*.js',
      'rxjs/**/*.js',
      '@angular2-material/**/*.+(js|css|svg)',
      'material-design-icons/**/*.+(css|svg|woff|ttf|eot|woff2)'
    ]
  });
  const ngTree = app.toTree();
  var appShellIndex = new AppShellPlugin(ngTree, 'index.html', 'app/issue-cli');
  var concatExtrasTree = new Funnel('src/client', {
    include: [
      'system.config.js',
      'auto-start.js'
    ]
  });
  var jsBundleTree = concat(mergeTrees([ngTree, concatExtrasTree]), {
    inputFiles: [
      // TODO: use minified for production build
      'vendor/es6-shim/es6-shim.js',
      'vendor/systemjs/dist/system-polyfills.js',
      'vendor/angular2/bundles/angular2-polyfills.js',
      'vendor/systemjs/dist/system.src.js',
      'vendor/rxjs/bundles/Rx.js',
      'vendor/angular2/bundles/angular2.dev.js',
      'vendor/angular2/bundles/http.dev.js',
      'vendor/angular2/bundles/router.dev.js',
      'system.config.js'
    ],
    footerFiles: ['auto-start.js'],
    sourceMapConfig: { enabled: true },
    allowNone: false,
    outputFile: '/app-concat.js'
  });
  return mergeTrees([ngTree, appShellIndex, jsBundleTree], { overwrite: true })
};
