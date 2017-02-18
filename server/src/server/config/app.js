'use strict';

import Export from './export';

export default Export({
  local: {
    PORT: 8000,
    WAIT_INTERVAL: 1000,
    LOG_LEVEL_WINSTON: 'silly',
    LOG_LEVEL_MORGAN: 'dev',
    WHITELIST_DOMAINS: [
      'http://localhost:8000'
    ]
  },
  staging: {
    PORT: process.env.PORT,
    WAIT_INTERVAL: 5000,
    LOG_LEVEL_WINSTON: 'silly',
    LOG_LEVEL_MORGAN: 'short',
    WHITELIST_DOMAINS: [
      'https://gt-course-surveys-dev.firebaseapp.com'
    ]
  },
  production: {
    PORT: process.env.PORT,
    WAIT_INTERVAL: 5000,
    LOG_LEVEL_WINSTON: 'info',
    LOG_LEVEL_MORGAN: 'tiny',
    WHITELIST_DOMAINS: [
      'https://gt-surveyor.firebaseapp.com',
      'https://omscentral.com'
    ]
  },
  test: {
    PORT: 8000,
    WAIT_INTERVAL: 0,
    LOG_LEVEL_WINSTON: 'silent',
    LOG_LEVEL_MORGAN: 'tiny',
    WHITELIST_DOMAINS: [
      'http://localhost:8000'
    ]
  }
});
