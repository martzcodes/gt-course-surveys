'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import conf from '../../conf';

gulp.task('babel:es7', () => {
  return gulp.src(`${conf.paths.src}/**/*.js`)
    .pipe(babel({
      plugins: [
        'transform-es2015-modules-commonjs',
        'transform-async-to-generator',
        'transform-runtime',
        'transform-exponentiation-operator'
      ]
    }))
    .pipe(gulp.dest(conf.paths.dist));
});
