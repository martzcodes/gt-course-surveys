'use strict';

import eslint from 'gulp-eslint';
import gulp from 'gulp';
import conf from '../../conf';

gulp.task('eslint:test', () => {
  return gulp.src(`${conf.paths.src}/**/*.spec.js`)
    .pipe(eslint({
      fix: true,
      rules: {
        'no-unused-expressions': 0
      },
      globals: [
        'describe',
        'describe',
        'xdescribe',
        'it',
        'it',
        'xit',
        'beforeEach',
        'afterEach'
      ]
    }))
    .pipe(eslint.format())
    // .pipe(eslint.failAfterError())
    .pipe(gulp.dest(`${conf.paths.src}/`));
});
