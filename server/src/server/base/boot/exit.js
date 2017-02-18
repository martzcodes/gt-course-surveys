'use strict';

import Logger from '../logger';

function onExit(options, error) {
  if (options.cleanup) {
    // cleanup...
  }

  if (error) {
    Logger.error(error);
  }

  if (options.exit) {
    process.exit();
  }
}

export default () => () => {
  process.stdin.resume();

  process.on('exit', onExit.bind(null, { cleanup: true }));
  process.on('SIGINT', onExit.bind(null, { exit: true }));
  process.on('uncaughtException', onExit.bind(null, { exit: true }));

  Logger.info('base.boot.exit: Done!');
};
