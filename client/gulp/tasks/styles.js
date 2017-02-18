'use strict';

import browserSync from 'browser-sync';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import { stream } from 'wiredep';
import conf from '../conf';

const $ = gulpLoadPlugins();

function cssTransform(path) {
  return `@import "${path.replace(`${conf.paths.src}/app/`, '')}";`;
}

function build() {
  const cssFiles = gulp.src([
    `${conf.paths.src}/app/core/scss/**/*.scss`,
    `${conf.paths.src}/app/core/**/*.scss`,
    `${conf.paths.src}/app/**/*.scss`,
    `!${conf.paths.src}/app/main/components/material-docs/demo-partials/**/*.scss`, // eslint-disable-line max-len
    `!${conf.paths.src}/app/core/scss/partials/**/*.scss`,
    `!${conf.paths.src}/app/index.scss`
  ], { read: false });

  const cssOptions = {
    transform: cssTransform,
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  return gulp.src(`${conf.paths.src}/app/index.scss`)
    .pipe($.inject(cssFiles, cssOptions))
    .pipe(stream())
    .pipe($.sourcemaps.init())
    .pipe($.sass({ style: 'expanded' })).on('error', conf.error('sass'))
    .pipe($.autoprefixer()).on('error', conf.error('autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(`${conf.paths.tmp}/serve/app/`));
}

gulp.task('styles-reload', ['styles'], () => {
  build().pipe(browserSync.stream());
});

gulp.task('styles', () => {
  build();
});
