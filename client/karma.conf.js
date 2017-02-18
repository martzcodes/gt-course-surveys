'use strict';

import _ from 'lodash';
import wiredep from 'wiredep';

import conf from './gulp/conf';

const HTML = [
  `${conf.paths.src}/**/*.html`
];

function getFiles() {
  const files = wiredep({ dependencies: true, devDependencies: true }).js
    .concat(HTML)
    .concat([
      `${conf.paths.src}/app/**/*.module.js`,
      `${conf.paths.src}/app/**/*.js`,
      `${conf.paths.src}/**/*.spec.js`
      // `${conf.paths.src}/**/*.mock.js`,
    ])
    .map((pattern) => ({ pattern }));

  files.push({
    pattern: `${conf.paths.src}/assets/**/*`,
    included: false,
    served: true,
    watched: false
  });

  return files;
}

module.exports = (config) => {
  config.set({
    files: getFiles(),
    singleRun: true,
    autoWatch: false,
    ngHtml2JsPreprocessor: {
      stripPrefix: `${conf.paths.src}/`,
      moduleName: 'generatorGulpAngular'
    },
    logLevel: 'WARN',
    frameworks: ['jasmine', 'angular-filesort'],
    angularFilesort: {
      whitelist: [`${conf.paths.src}/**/!(*.html|*.spec|*.mock).js`]
    },
    browsers: [
      'Chrome'
      // 'Firefox',
      // 'PhantomJS',
    ],
    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-angular-filesort',
      'karma-coverage',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
      includeAllSources: true
    },
    preprocessors: _.fromPairs(HTML.map((path) => [path, 'ng-html2js'])),
    reporters: ['progress'],
    proxies: {
      '/assets/': `/base/${conf.paths.src}/assets/`
    }
  });
};
