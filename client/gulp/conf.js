'use strict';

var gutil = require('gulp-util');

module.exports.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  coverage: 'coverage'
};

module.exports.wiredep = {
  directory: 'bower_components'
};

module.exports.errorHandler = function (title) {
  return function (error) {
    gutil.log(gutil.colors.red('[' + title + ']'), error.toString());

    this.emit('end');
  };
};
