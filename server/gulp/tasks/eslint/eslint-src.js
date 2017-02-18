'use strict';

import eslint from 'gulp-eslint';
import gulp from 'gulp';
import conf from '../../conf';

gulp.task('eslint:src', () => {
  return gulp.src([
    `${conf.paths.src}/**/*.js`,
    `!${conf.paths.src}/**/*.spec.js`
  ])
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    // .pipe(eslint.failAfterError())
    .pipe(gulp.dest(`${conf.paths.src}/`));
});
