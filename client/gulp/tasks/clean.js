'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import conf from '../conf';

const $ = gulpLoadPlugins();

const PATHS = [
  `${conf.paths.dist}/`,
  `${conf.paths.tmp}/`,
  `${conf.paths.coverage}/`
];

gulp.task('clean', () => gulp.src(PATHS, { read: false }).pipe($.clean()));
