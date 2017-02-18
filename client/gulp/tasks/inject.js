'use strict';

import browserSync from 'browser-sync';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import { stream } from 'wiredep';
import conf from '../conf';

const $ = gulpLoadPlugins();

const CSS = [
  `${conf.paths.tmp}/serve/app/**/*.css`,
  `!${conf.paths.tmp}/serve/app/vendor.css`
];

const JS = [
  `${conf.paths.src}/app/**/*.module.js`,
  `${conf.paths.src}/app/**/*.js`,
  `!${conf.paths.src}/app/**/*.spec.js`,
  `!${conf.paths.src}/app/**/*.mock.js`
];

gulp.task('inject', ['scripts', 'styles'], () => {
  const css = gulp.src(CSS, { read: false });

  const js = gulp.src(JS)
    .pipe($.babel(conf.babel))
    .pipe($.angularFilesort()).on('error', conf.error('angular-file-sort'));

  const options = {
    ignorePath: [conf.paths.src, `${conf.paths.tmp}/serve`],
    addRootSlash: false
  };

  return gulp.src(`${conf.paths.src}/*.html`)
    .pipe($.inject(css, options))
    .pipe($.inject(js, options))
    .pipe(stream())
    .pipe(gulp.dest(`${conf.paths.tmp}/serve`));
});

gulp.task('inject-reload', ['inject'], () => browserSync.reload());
