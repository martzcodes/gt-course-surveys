'use strict';

import gulp from 'gulp';
import requireDir from 'require-dir';
import run from 'run-sequence';

requireDir('./gulp/tasks', { recurse: true });

gulp.task('eslint', [
  'eslint:top',
  'eslint:gulp',
  'eslint:src',
  'eslint:test'
]);

gulp.task('clean', ['clean:dist', 'clean:coverage', 'clean:rules']);
gulp.task('compile', ['babel:es7']);
gulp.task('copy', ['copy:keys', 'copy:imports']);

gulp.task('build', (cb) => {
  run('clean', 'compile', 'copy', cb);
});

gulp.task('test', (cb) => {
  run('build', 'test:server', cb);
});

gulp.task('serve', (cb) => {
  run('build', 'start:server', cb);
});
