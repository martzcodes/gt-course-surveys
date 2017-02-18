'use strict';

import Logger from '../logger';

/* eslint-disable no-extend-native */

/* eslint-disable no-bitwise */
String.prototype.hashCode = function hashCode() {
  if (this.length <= 0) {
    return 0;
  }

  let hash = 0;
  for (let i = 0, l = this.length; i < l; i++) {
    hash = ((hash << 5) - hash) + this.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};
/* eslint-enable */

export default () => () => {
  Logger.info('base.boot.extensions: Done!');
};
