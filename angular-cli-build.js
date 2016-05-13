/* global require, module */

var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function(defaults) {
  return new Angular2App(defaults, {
    vendorNpmFiles: [
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'zone.js/dist/*.js',
      'es6-shim/es6-shim.js',
      'reflect-metadata/*.js',
      'rxjs/**/*.js',
      '@angular/**/*.js',
      '@angular2-material/**/*.+(js|map|css|svg)',
      'angularfire2/**/*.js',
      'firebase/lib/firebase-web.js',
      'hammerjs/hammer.min.js',
      'material-design-icons/navigation/svg/production/ic_menu_24px.svg',
      'material-design-icons/navigation/svg/production/ic_arrow_back_24px.svg',
      'material-design-icons/content/svg/production/ic_filter_list_24px.svg',
      'material-design-icons/action/svg/production/ic_delete_24px.svg',
      '@ngrx/**/*.js'
    ]
  });
};
