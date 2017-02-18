'use strict';

import moment from 'moment';
import winston from 'winston';
import appConfig from '../config/app';

winston.emitErrs = true;

const LOGGER = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: appConfig.LOG_LEVEL_WINSTON,
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: () => moment().format('YYYY-MM-DD hh:mm:ss A'),
      humanReadableUnhandledException: true
    })
  ],
  exitOnError: false
});

export default LOGGER;
