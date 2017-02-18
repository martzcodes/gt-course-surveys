'use strict';

import _ from 'lodash';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import conf from '../conf';

const $ = gulpLoadPlugins();

gulp.task('fonts:staging', () => gulp.src('./bower.json')
  .pipe($.mainBowerFiles())
  .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
  .pipe($.flatten())
  .pipe(gulp.dest(`${conf.paths.dist}/fonts/`)));

gulp.task('other:staging', () => gulp.src([
  `${conf.paths.src}/**/*`,
  `!${conf.paths.src}/**/*.{css}`,
  `!${conf.paths.src}/app/index.scss`
])
  .pipe($.filter((thing) => thing.stat.isFile()))
  .pipe(gulp.dest(`${conf.paths.dist}/`)));

function cssTransform(path) {
  return `@import "${path.replace(`${conf.paths.src}/app/`, '')}";`;
}

gulp.task('html:staging', ['inject'], () => {
  const cssFiles = gulp.src([
    `${conf.paths.src}/app/core/global-scss/**/*.scss`,
    `${conf.paths.src}/app/core/**/*.scss`,
    `${conf.paths.src}/app/**/*.scss`,
    `!${conf.paths.src}/app/core/global-scss/partials/**/*.scss`,
    `!${conf.paths.src}/app/index.scss`
  ], { read: false });

  const cssOptions = {
    transform: cssTransform,
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  gulp.src(`${conf.paths.src}/app/index.scss`)
    .pipe($.inject(cssFiles, cssOptions))
    .pipe(gulp.dest(`${conf.paths.dist}/app/`));

  const filters = {
    js: $.filter('**/*.js', { restore: true }),
    css: $.filter('**/*.css', { restore: true }),
    babel: ['app.js']
  };

  return gulp.src(`${conf.paths.tmp}/serve/*.html`)
    .pipe($.useref())
    .pipe(filters.js)
    .pipe($.babel(_.assign({}, conf.babel, { only: filters.babel })))
    .pipe($.ngAnnotate())
    .pipe(filters.js.restore)
    .pipe(filters.css)
    .pipe($.sourcemaps.init())
    .pipe($.sourcemaps.write('maps'))
    .pipe(filters.css.restore)
    .pipe(gulp.dest(`${conf.paths.dist}/`))
    .pipe($.size({ title: `${conf.paths.dist}/`, showFiles: true }));
});

gulp.task('build:staging', [
  'fonts:staging',
  'other:staging',
  'html:staging'
]);
