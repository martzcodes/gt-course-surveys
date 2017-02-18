'use strict';

import { config } from 'dotenv';
import gulp from 'gulp';

config({ path: './gulp/.env' });

require('require-dir')('./gulp', { recurse: true });

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
