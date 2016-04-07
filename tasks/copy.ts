var merge2 = require('merge2');
var gulp = require('gulp');

export function copyTask (vendorSrcs:string[], appSrcs:string[], vendorDest:string, appDest:string) {
  return () => {
    var vendorStream = gulp
      .src(vendorSrcs)
      .pipe(gulp.dest(vendorDest));
    var appStream = gulp.src(appSrcs)
      .pipe(gulp.dest(appDest));
    return merge2(vendorStream, appStream);
  };
}