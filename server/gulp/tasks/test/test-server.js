'use strict';

import exit from 'gulp-exit';
import gulp from 'gulp';
import istanbul from 'gulp-istanbul';
import mocha from 'gulp-mocha';
import conf from '../../conf';

gulp.task('test:server', ['build'], () => {
  process.env.NODE_ENV = 'test';
  return gulp.src([
    `${conf.paths.dist}/**/*.js`,
    `!${conf.paths.dist}/**/*.spec.js`
  ])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src(`${conf.paths.dist}/**/*.spec.js`)
        .pipe(mocha({
          reporter: 'spec',
          require: './test-helper'
        }))
        .pipe(istanbul.writeReports())
        .pipe(exit());
    });
});
