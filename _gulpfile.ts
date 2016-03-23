declare var require:any;
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
const clientVendorDeps = ['node_modules/angular2/**/*.js', 'node_modules/systemjs/**/*.js'];
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
