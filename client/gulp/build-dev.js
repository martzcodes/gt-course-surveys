'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('html-dev', ['inject'], function () {
  // Copied from styles.js
  var injectFiles = gulp.src([
    path.join(conf.paths.src, '/app/core/global-scss/**/*.scss'),
    path.join(conf.paths.src, '/app/core/**/*.scss'),
    path.join(conf.paths.src, '/app/**/*.scss'),
    path.join('!' + conf.paths.src, '/app/core/global-scss/partials/**/*.scss'),
    path.join('!' + conf.paths.src, '/app/index.scss')
  ], {
    read: false
  });

  var injectOptions = {
    transform: function (filePath) {
      filePath = filePath.replace(conf.paths.src + '/app/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  gulp.src([
      path.join(conf.paths.src, '/app/index.scss')
    ])
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/app/')));
  // End - Copied from styles.js

  var htmlFilter = $.filter('*.html', {
    restore: true
  });
  var jsFilter = $.filter('**/*.js', {
    restore: true
  });
  var cssFilter = $.filter('**/*.css', {
    restore: true
  });

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.useref())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.sourcemaps.init())
    .pipe($.sourcemaps.write('maps'))
    .pipe(cssFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({
      title: path.join(conf.paths.dist, '/'),
      showFiles: true
    }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts-dev', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('other-dev', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
      path.join(conf.paths.src, '/**/*'),
      path.join('!' + conf.paths.src, '/**/*.{css}'),
      path.join('!' + conf.paths.src, '/app/index.scss')
    ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', function () {
  return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('build:dev', ['html-dev', 'fonts-dev', 'other-dev']);
