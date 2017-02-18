'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import conf from '../conf';

const $ = gulpLoadPlugins();

gulp.task('partials', () => gulp.src([
  `${conf.paths.src}/app/**/*.html`,
  `${conf.paths.tmp}/serve/app/**/*.html`
])
  .pipe($.htmlmin({
    collapseWhitespace: true,
    removeComments: true
  }))
  .pipe($.angularTemplatecache('templates.js', {
    module: 'app',
    root: 'app'
  }))
  .pipe(gulp.dest(`${conf.paths.tmp}/partials/`)));
