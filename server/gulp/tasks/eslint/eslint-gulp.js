'use strict';

import eslint from 'gulp-eslint';
import gulp from 'gulp';
import conf from '../../conf';

gulp.task('eslint:gulp', () => {
  return gulp.src(`${conf.paths.gulp}/**/*.js`)
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    // .pipe(eslint.failAfterError())
    .pipe(gulp.dest(`${conf.paths.gulp}/`));
});
