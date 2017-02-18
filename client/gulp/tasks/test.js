'use strict';

import gulp from 'gulp';
import karma from 'karma';
import conf from '../conf';

const HTML = [
  `${conf.paths.src}/**/*.html`
];

const JS = [
  `${conf.paths.src}/**/!(*.spec).js`
];

function run(done, oneTime) {
  const preprocessors = {};
  HTML.forEach((path) => { preprocessors[path] = ['ng-html2js']; });
  if (oneTime) {
    JS.forEach((path) => { preprocessors[path] = ['coverage']; });
  }

  const reporters = ['progress'];
  if (oneTime) {
    reporters.push('coverage');
  }

  const karmaConfig = {
    configFile: `${__dirname}/../karma.conf.js`,
    singleRun: !!oneTime,
    autoWatch: !oneTime,
    preprocessors,
    reporters
  };

  const server = new karma.Server(karmaConfig, () => done());
  server.start();
}

gulp.task('test', ['scripts'], (done) => {
  run(done, true);
});

gulp.task('test:watch', ['watch'], (done) => {
  run(done, false);
});
