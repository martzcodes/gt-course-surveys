'use strict';

import _ from 'lodash';
import bluebird from 'bluebird';
import fs from 'fs';
import requireDir from 'require-dir';
import Logger from '../../logger';

bluebird.promisifyAll(fs);

function main() {
  const imports = _.chain(requireDir('./importers'))
    .map('default')
    .map((importer) => importer.run())
    .value();

  return Promise.all(imports);
}

Logger.info('base.data.imports.imports: Running...');

main()
  .then(() => {
    Logger.info('base.data.imports.imports: Done!');
    process.exit(0);
  })
  .catch((error) => {
    Logger.error('base.data.imports.imports:', error);
    process.exit(1);
  });
