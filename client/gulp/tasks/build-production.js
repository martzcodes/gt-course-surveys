'use strict';

import _ from 'lodash';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import conf from '../conf';

const $ = gulpLoadPlugins();

gulp.task('fonts:production', () => gulp.src('./bower.json')
  .pipe($.mainBowerFiles())
  .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
  .pipe($.flatten())
  .pipe(gulp.dest(`${conf.paths.dist}/fonts/`)));

gulp.task('other:production', () => gulp.src([
  `${conf.paths.src}/**/*`,
  `!${conf.paths.src}/**/*.{html,css,js,scss}`
])
  .pipe($.filter((thing) => thing.stat.isFile()))
  .pipe(gulp.dest(`${conf.paths.dist}/`)));

gulp.task('html:production', ['inject', 'partials'], () => {
  const templatesPath = `${conf.paths.tmp}/partials/templates.js`;
  const templates = gulp.src(templatesPath, { read: false });
  const templatesOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: `${conf.paths.tmp}/partials`,
    addRootSlash: false
  };

  const filters = {
    js: $.filter('**/*.js', { restore: true }),
    css: $.filter('**/*.css', { restore: true }),
    html: $.filter('*.html', { restore: true }),
    babel: ['app.js', 'templates.js']
  };

  return gulp.src(`${conf.paths.tmp}/serve/*.html`)
    .pipe($.inject(templates, templatesOptions))
    .pipe($.useref())
    .pipe(filters.js)
    .pipe($.babel(_.assign({}, conf.babel, { only: filters.babel })))
    .pipe($.sourcemaps.init())
    .pipe($.ngAnnotate())
    .pipe($.uglify()).on('error', conf.error('uglify'))
    .pipe($.rev())
    .pipe($.sourcemaps.write('maps'))
    .pipe(filters.js.restore)
    .pipe(filters.css)
    .pipe($.sourcemaps.init())
    .pipe($.cleanCss())
    .pipe($.rev())
    .pipe($.sourcemaps.write('maps'))
    .pipe(filters.css.restore)
    .pipe($.revReplace())
    .pipe(filters.html)
    .pipe($.htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(filters.html.restore)
    .pipe(gulp.dest(`${conf.paths.dist}/`))
    .pipe($.size({ title: `${conf.paths.dist}/`, showFiles: true }));
});

gulp.task('build:production', [
  'fonts:production',
  'other:production',
  'html:production'
]);
