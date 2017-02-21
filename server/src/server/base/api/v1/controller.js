'use strict';

import _ from 'lodash';
import requireDir from 'require-dir';

const reducers = _.mapValues(requireDir('./reducers'), 'default');

class Controller {
  static async receive(req, res) {
    try {
      const { type, data } = req.body;
      const reducer = reducers[_.toLower(type)];
      if (reducer) {
        res.status(200).json({
          meta: { status: 200 },
          data: { result: await reducer.reduce(data), error: null }
        });
      } else {
        res.status(400).json({
          meta: { status: 400 },
          data: { result: null, error: 'Unknown request type.' }
        });
      }
    } catch (error) {
      res.status(500).json({
        meta: { status: 500 },
        data: { result: null, error }
      });
    }
  }
}

export default Controller;
