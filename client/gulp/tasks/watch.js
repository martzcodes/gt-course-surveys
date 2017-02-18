'use strict';

import _ from 'lodash';
import browserSync from 'browser-sync';
import gulp from 'gulp';
import conf from '../conf';

const JS = [
  `${conf.paths.src}/app/**/*.js`
];

const CSS = [
  `${conf.paths.src}/app/**/*.css`,
  `${conf.paths.src}/app/**/*.scss`
];

const HTML = [
  `${conf.paths.src}/app/**/*.html`
];

const JSON = [
  `${conf.paths.src}/app/**/*.json`
];

gulp.task('watch', ['inject'], () => {
  gulp.watch(['bower.json', `${conf.paths.src}/*.html`], ['inject-reload']);

  gulp.watch(JS, (event) => {
    if (event.type === 'changed') {
      gulp.start('scripts-reload');
    } else {
      gulp.start('inject-reload');
    }
  });

  gulp.watch(CSS, (event) => {
    if (event.type === 'changed') {
      gulp.start('styles-reload');
    } else {
      gulp.start('inject-reload');
    }
  });

  gulp.watch(_.union([HTML, JSON]), (event) => {
    browserSync.reload(event.path);
  });
});
