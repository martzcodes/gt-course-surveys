'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('webdriver-update', $.protractor.webdriver_update);
gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractor(done) {
  var params = process.argv;
  var args = params.length > 3 ? [params[3], params[4]] : [];

  gulp.src(path.join(conf.paths.e2e, '/**/*.js'))
    .pipe($.protractor.protractor({
      configFile: 'protractor.conf.js',
      args: args
    }))
    .on('error', function (error) {
      console.log(error.stack);
      throw error;
    })
    .on('end', function () {
      browserSync.exit();
      done();
    });
}

gulp.task('protractor', ['protractor:src']);
gulp.task('protractor:src', ['serve:e2e', 'webdriver-update'], runProtractor);
gulp.task('protractor:dist', ['serve:e2e-dist', 'webdriver-update'], runProtractor);
