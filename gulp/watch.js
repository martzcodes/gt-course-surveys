'use strict';

var path = require('path');
var gulp = require('gulp');
var paths = gulp.paths;

var browserSync = require('browser-sync');

function isOnlyChange(event) {
    return event.type === 'changed';
}

gulp.task('watch', ['inject'], function () {
    gulp.watch([path.join(paths.src, '/*.html'), 'bower.json'], ['inject']);

    gulp.watch([
        path.join(paths.src, '/app/**/*.css'),
        path.join(paths.src, '/app/**/*.scss')
    ], function (event) {
        if (isOnlyChange(event)) {
            gulp.start('styles');
        } else {
            gulp.start('inject');
        }
    });

    gulp.watch(path.join(paths.src, '/app/**/*.js'), function (event) {
        if (isOnlyChange(event)) {
            gulp.start('scripts');
        } else {
            gulp.start('inject');
        }
    });

    gulp.watch(path.join(paths.src, '/app/**/*.html'), function (event) {
        browserSync.reload(event.path);
    });
});
