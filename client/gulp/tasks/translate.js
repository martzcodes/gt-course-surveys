'use strict';

import bluebird from 'bluebird';
import map from 'map-stream';
import gulp from 'gulp';
import jsonFormat from 'gulp-json-format';
import rename from 'gulp-rename';
import traverse from 'traverse';
import transform from 'vinyl-transform';
import util from 'gulp-util';
import MicrosoftTranslator from 'mstranslator';
import conf from '../conf';

bluebird.promisifyAll(MicrosoftTranslator.prototype);

const Translator = new MicrosoftTranslator({
  client_id: process.env.MS_CLIENT_ID,
  client_secret: process.env.MS_CLIENT_SECRET
}, true);

function getTranslation(string, to) {
  const text = string;
  const from = 'en';

  return Translator.translateAsync({ text, from, to });
}

function getTranslations(strings, to) {
  const promises = [];

  traverse(strings).forEach((string) => {
    if (typeof string !== 'object') {
      promises.push(getTranslation(string, to));
    }
  });

  return Promise.all(promises);
}

function translateTable(to) {
  return transform((fileName) => {
    const shortFileName = fileName.substring(fileName.indexOf('/app/'));
    return map((data, done) => {
      const strings = JSON.parse(data);
      getTranslations(strings, to)
        .then((translations) => {
          let index = 0;
          // eslint-disable-next-line func-names
          const translated = traverse(strings).forEach(function (string) {
            if (typeof string !== 'object') {
              this.update(translations[index]);
              index += 1;
            }
          });
          util.log(`${util.colors.green(shortFileName)} (${to}:${index})`);
          done(null, JSON.stringify(translated));
        })
        .catch((error) => {
          util.log(util.colors.red(error.message || shortFileName));
          done(null, data);
        });
    });
  });
}

function translate(to) {
  util.log(`Translating ${util.colors.green(to)}...`);
  return gulp.src(`${conf.paths.src}/app/**/i18n/en.json`)
    .pipe(translateTable(to))
    .pipe(jsonFormat(4))
    .pipe(rename({ basename: to }))
    .pipe(gulp.dest(`${conf.paths.src}/app`));
}

gulp.task('translate:de', () => translate('de'));
gulp.task('translate:es', () => translate('es'));
gulp.task('translate:fr', () => translate('fr'));
gulp.task('translate:hi', () => translate('hi'));
gulp.task('translate:tr', () => translate('tr'));

gulp.task('translate', [
  'translate:de',
  'translate:es',
  'translate:fr',
  'translate:hi',
  'translate:tr'
]);
