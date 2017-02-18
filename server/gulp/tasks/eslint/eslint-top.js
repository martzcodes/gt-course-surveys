'use strict';

import eslint from 'gulp-eslint';
import gulp from 'gulp';

gulp.task('eslint:top', () => {
  return gulp.src('*.js')
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    // .pipe(eslint.failAfterError())
    .pipe(gulp.dest('.'));
});
