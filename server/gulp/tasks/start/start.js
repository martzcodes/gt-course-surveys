'use strict';

import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import conf from '../../conf';

gulp.task('start:server', () => {
  nodemon({
    script: `${conf.paths.dist}/server/server.js`,
    tasks: ['build'],
    ignore: [conf.paths.dist],
    delay: 5
  });
});
