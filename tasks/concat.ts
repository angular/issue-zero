var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

export function concatTask (srcs:string[], outFile:string, dest:string) {
  return () => {
    return gulp.src(srcs)
      .pipe(concat(outFile))
      .pipe(uglify({
        mangle: false
      }))
      .pipe(gulp.dest(dest));
  }

}
