'use strict';

import browserSync from 'browser-sync';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import conf from '../conf';

const $ = gulpLoadPlugins();

function build() {
  return gulp.src(`${conf.paths.src}/app/**/*.js`)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.size());
}

gulp.task('scripts-reload', () => build().pipe(browserSync.stream()));

gulp.task('scripts', () => build());
