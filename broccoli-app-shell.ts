import 'angular2-universal-polyfills';
import {prerender} from 'angular2-gulp-prerender';
import {provide} from 'angular2/core';
import {APP_BASE_HREF, ROUTER_PROVIDERS} from 'angular2/router';
import {IssueCliApp} from './src/client/app/issue-cli';
import {Bootloader, REQUEST_URL, NODE_LOCATION_PROVIDERS} from 'angular2-universal';
import {IS_PRERENDER, IS_POST_LOGIN} from './src/client/app/config';
import {FIREBASE_PROVIDERS, defaultFirebase} from 'angularfire2';

const fse           = require('fs-extra');
const path          = require('path');
const Plugin        = require('broccoli-caching-writer');

// TODO(jeffbcross): I don't know how to extend untyped classes
AppShellPlugin.prototype = Object.create(Plugin.prototype);
AppShellPlugin.prototype.constructor = AppShellPlugin;
function AppShellPlugin (inputNodes, indexPath, appComponentPath, options) {
  Plugin.call(this, [inputNodes], options);
  this.indexPath = indexPath;
  this.appComponentPath = appComponentPath;
}

AppShellPlugin.prototype.build = function () {
  var sourceHtml = fse.readFileSync(path.resolve(this.inputPaths[0], this.indexPath), 'utf-8');
  var options = {
    document: Bootloader.parseDocument(sourceHtml),
    directives: [ IssueCliApp ],
    providers: [
      provide(APP_BASE_HREF, {useValue: '/'}),
      provide(REQUEST_URL, {useValue: '/'}),
      provide(IS_POST_LOGIN, {
        useValue: false
      }),
      ROUTER_PROVIDERS,
      NODE_LOCATION_PROVIDERS,
      provide(IS_PRERENDER, {
        useValue: true
      }),
      FIREBASE_PROVIDERS,
      defaultFirebase('https://issue-zero.firebaseio.com')
    ],
    preboot: true
  }

    var bootloader = Bootloader.create(options);
    return bootloader.serializeApplication().then(html =>  fse.outputFileSync(path.resolve(this.outputPath, this.indexPath), html, 'utf-8'));
}

module.exports = AppShellPlugin;
