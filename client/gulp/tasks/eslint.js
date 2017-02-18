'use strict';

import _ from 'lodash';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import conf from '../conf';

const $ = gulpLoadPlugins();

const TASKS = [{
  name: 'eslint:base',
  src: '*.js',
  dest: '.'
}, {
  name: 'eslint:gulp',
  src: `${conf.paths.gulp}/**/*.js`,
  dest: `${conf.paths.gulp}/`
}, {
  name: 'eslint:config',
  src: `${conf.paths.config}/**/*.js`,
  dest: `${conf.paths.config}/`
}, {
  name: 'eslint:src',
  src: `${conf.paths.src}/**/*.js`,
  dest: `${conf.paths.src}/`
}];

TASKS.forEach((task) => {
  gulp.task(task.name, () => gulp.src(task.src)
    .pipe($.eslint({ fix: true }))
    .pipe($.eslint.format())
    .pipe(gulp.dest(task.dest)));
});

gulp.task('eslint', _.map(TASKS, 'name'));
