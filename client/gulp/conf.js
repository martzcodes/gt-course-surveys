'use strict';

import util from 'gulp-util';

export default {
  paths: {
    gulp: 'gulp',
    config: '.config',
    coverage: 'coverage',
    tmp: '.tmp',
    src: 'src',
    dist: 'dist'
  },
  babel: {
    presets: ['latest'],
    plugins: ['transform-async-functions']
  },
  error: (label) => function handle(error) {
    util.log(util.colors.red(`[${label}]`), error.toString());
    this.emit('end');
  }
};
