'use strict';

import del from 'del';
import gulp from 'gulp';
import conf from '../../conf';

gulp.task('clean:coverage', () => {
  return del([conf.paths.coverage]);
});
