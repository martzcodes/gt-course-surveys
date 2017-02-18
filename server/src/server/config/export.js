'use strict';

export default (config) => config[process.env.NODE_ENV || 'local'];
