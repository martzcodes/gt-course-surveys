'use strict';

import _ from 'lodash';
import browserSync from 'browser-sync';
import browserSyncSpa from 'browser-sync-spa';
import gulp from 'gulp';
import conf from '../conf';

browserSync.use(browserSyncSpa({ selector: '[ng-app]' }));

const BOWER = { '/bower_components': 'bower_components' };

function serve(baseDir) {
  browserSync.instance = browserSync.init({
    startPath: '/',
    browser: 'default',
    server: {
      baseDir,
      routes: _.includes(baseDir, conf.paths.src) ? BOWER : null
    }
  });
}

gulp.task('serve:local', ['watch'], () => {
  serve([`${conf.paths.tmp}/serve`, conf.paths.src]);
});

gulp.task('serve:staging', ['build:staging'], () => {
  serve(conf.paths.dist);
});

gulp.task('serve:production', ['build:production'], () => {
  serve(conf.paths.dist);
});
