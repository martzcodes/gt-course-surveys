'use strict';

import gulp from 'gulp';
import conf from '../../conf';

gulp.task('copy:keys', () => {
  return gulp.src(`${conf.paths.src}/server/config/keys/**/*.json`)
    .pipe(gulp.dest(`${conf.paths.dist}/server/config/keys`));
});
