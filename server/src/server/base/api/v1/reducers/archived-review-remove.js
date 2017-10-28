'use strict';

import { archive } from '../../../business/database';

class Reducer {
  static async reduce(id) {
    await archive.ref('RVW').child(id).remove();
    return true;
  }
}

export default Reducer;
