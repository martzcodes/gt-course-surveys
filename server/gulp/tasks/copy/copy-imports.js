'use strict';

import gulp from 'gulp';
import conf from '../../conf';

gulp.task('copy:imports', () => {
  return gulp.src(`${conf.paths.src}/server/base/data/imports/**/*.txt`)
    .pipe(gulp.dest(`${conf.paths.dist}/server/base/data/imports`));
});
