/// <reference path="typings/main/ambient/node/index.d.ts" />
var gulp = require('gulp');
var ts = require('gulp-typescript');
var fse = require('fs-extra');
var merge2 = require('merge2');

const clientTsProject = ts.createProject('src/client/tsconfig.json', {
  typescript: require('typescript'),
});

const clientRoot = 'src/client';
const distClientRoot = 'dist/client';
const clientTsTree = [`${clientRoot}/app/**/*.ts`];
const clientVendorDeps = [
  'node_modules/angular2/**/*.js',
  'node_modules/systemjs/**/*.+(js|map)',
  'node_modules/rxjs/**/*.+(js|map)',
  'node_modules/zone.js/dist/*.js',
  'node_modules/reflect-metadata/Reflect.+(js|map)',
  'node_modules/@angular2-material/**/*.+(js|css|html|map)',
  'node_modules/material-design-icons/**/*.+(css|svg|woff|ttf|eot|woff2)'
];
const clientHtmlTree = [`${clientRoot}/**/*.html`];

gulp.task('clean', (done) => {
  return fse.remove('dist', done);
});

gulp.task('build:client', ['clean'], () => {
  return merge2([
    gulp.src(clientTsTree.concat('typings/browser/ambient/**/*.ts'))
      .pipe(ts(clientTsProject))
      .pipe(gulp.dest(`${distClientRoot}/app`)),
    gulp.src(clientHtmlTree)
      .pipe(gulp.dest(distClientRoot)),
    gulp.src(`${clientRoot}/firebase.json`)
      .pipe(gulp.dest(distClientRoot)),
    gulp.src(clientVendorDeps, {base: 'node_modules'})
      .pipe(gulp.dest(`${distClientRoot}/vendor`))
  ]);
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

function doCheckFormat() {
  var clangFormat = require('clang-format');
  var gulpFormat = require('gulp-clang-format');

  return gulp.src(`${clientRoot}/**/*.ts`)
      .pipe(gulpFormat.checkFormat('file', clangFormat));
}
