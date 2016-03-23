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
const clientTsTree = [`${clientRoot}/app/**/*.ts`, 'typings/browser/ambient/**/*.ts'];
const clientVendorDeps = [
  'node_modules/angular2/**/*.js',
  'node_modules/systemjs/**/*.js',
  'node_modules/rxjs/**/*.js',
  'node_modules/zone.js/dist/*.js',
  'node_modules/reflect-metadata/Reflect.js'
];
const clientHtmlTree = [`${clientRoot}/**/*.html`];

gulp.task('clean', (done) => {
  return fse.remove('dist', done);
});

gulp.task('build:client', ['clean'], () => {
  return merge2([
    gulp.src(clientTsTree)
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

function doCheckFormat() {
  var clangFormat = require('clang-format');
  var gulpFormat = require('gulp-clang-format');

  return gulp.src(`${clientRoot}/**/*.ts`)
      .pipe(gulpFormat.checkFormat('file', clangFormat));
}
