'use strict';

import del from 'del';
import gulp from 'gulp';
import conf from '../../conf';

gulp.task('clean:dist', () => {
  return del([conf.paths.dist]);
});
