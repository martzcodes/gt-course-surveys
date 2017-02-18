'use strict';

import _ from 'lodash';
import bootable from 'bootable';
import express from 'express';
import moment from 'moment';
import requireDir from 'require-dir';
import Logger from './base/logger';

const app = bootable(express());
const boot = _.mapValues(requireDir('./base/boot'), 'default');

app.phase(boot.extensions());
app.phase(boot.config(app));
app.phase(boot.cors(app));
app.phase(boot.routes(app));
app.phase(boot.caches());
app.phase(boot.services());
app.phase(boot.exit());
app.phase(boot.wait());

app.boot((error) => {
  if (error) {
    Logger.error(error);
    return;
  }

  if (process.env.NODE_ENV === 'test') {
    return;
  }

  process.env.INIT_MOMENT = moment.utc().format();

  const server = app.listen(app.get('port'), () => {
    Logger.info(`server: Listening on port ${server.address().port}...`);
  });
});
