'use strict';

var gulp = require('gulp');
var conf = require('./conf');
var run  = require('run-sequence');

var $ = require('gulp-load-plugins')();

gulp.task('deploy:translate', $.shell.task([
  'gulp translate --from en --to de',
  'gulp translate --from en --to es',
  'gulp translate --from en --to fr',
  'gulp translate --from en --to hi',
  'gulp translate --from en --to tr'
]));

// LOCAL

gulp.task('deploy:local', [
    'clean',
    'deploy:translate',
    'deploy:dev:rules',
    'deploy:local:constants'
  ], function () {
    gulp.start('serve:dist');
  });

gulp.task('deploy:local:constants', function () {
  return gulp.src('deploy/local/index.constants.js')
    .pipe(gulp.dest('src/app/', {overwrite: true}));
});

// LOCAL-WATCH

gulp.task('deploy:local-watch', [
    'clean',
    'deploy:dev:rules',
    'deploy:local:constants'
  ], function () {
    gulp.start('serve');
  });

// DEV

gulp.task('deploy:dev', function () {
  run([
    'clean',
    'deploy:dev:rules',
    'deploy:dev:constants'
  ], 'build', 'deploy:dev:hosting');
});

gulp.task('deploy:dev:rules', $.shell.task([
  'blaze rules.yaml &>/dev/null',
  'firebase use dev',
  'firebase deploy --only database'
]));

gulp.task('deploy:dev:hosting', $.shell.task([
  'firebase use dev',
  'firebase deploy --only hosting',
  'firebase open hosting:site'
]));

gulp.task('deploy:dev:constants', function () {
  return gulp.src('deploy/dev/index.constants.js')
    .pipe(gulp.dest('src/app/', {overwrite: true}));
});

// PRD

gulp.task('deploy:prd', function () {
  run([
    'clean',
    'deploy:prd:rules',
    'deploy:prd:constants'
  ], 'build', 'deploy:prd:hosting');
});

gulp.task('deploy:prd:rules', $.shell.task([
  'blaze rules.yaml &>/dev/null',
  'firebase use prd',
  'firebase deploy --only database'
]));

gulp.task('deploy:prd:hosting', $.shell.task([
  'firebase use prd',
  'firebase deploy --only hosting',
  'firebase open hosting:site'
]));

gulp.task('deploy:prd:constants', function () {
  return gulp.src('deploy/prd/index.constants.js')
    .pipe(gulp.dest('src/app/', {overwrite: true}));
});
