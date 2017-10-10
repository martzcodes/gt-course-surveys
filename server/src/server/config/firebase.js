'use strict';

import firebase from 'firebase-admin';
import firebaseKeyLocal from './keys/firebase/local.json';
import firebaseKeyLocalArchive from './keys/firebase/local-archive.json';
import firebaseKeyProduction from './keys/firebase/production.json';
import firebaseKeyProductionArchive from './keys/firebase/production-archive.json'; // eslint-disable-line max-len
import firebaseKeyStaging from './keys/firebase/staging.json';
import firebaseKeyStagingArchive from './keys/firebase/staging-archive.json';
import firebaseKeyTest from './keys/firebase/test.json';
import Export from './export';

export default Export({
  local: {
    normal: {
      CREDENTIAL: firebase.credential.cert(firebaseKeyLocal),
      DATABASE_URL: 'https://gt-course-surveys-dev.firebaseio.com'
    },
    archive: {
      CREDENTIAL: firebase.credential.cert(firebaseKeyLocalArchive),
      DATABASE_URL: 'https://gt-course-surveys-dev-archive.firebaseio.com'
    }
  },
  staging: {
    normal: {
      CREDENTIAL: firebase.credential.cert(firebaseKeyStaging),
      DATABASE_URL: 'https://gt-course-surveys-dev.firebaseio.com'
    },
    archive: {
      CREDENTIAL: firebase.credential.cert(firebaseKeyStagingArchive),
      DATABASE_URL: 'https://gt-course-surveys-dev-archive.firebaseio.com'
    }
  },
  production: {
    normal: {
      CREDENTIAL: firebase.credential.cert(firebaseKeyProduction),
      DATABASE_URL: 'https://gt-surveyor.firebaseio.com'
    },
    archive: {
      CREDENTIAL: firebase.credential.cert(firebaseKeyProductionArchive),
      DATABASE_URL: 'https://gt-course-surveys-prd-archive.firebaseio.com'
    }
  },
  test: {
    normal: {
      CREDENTIAL: firebase.credential.cert(firebaseKeyTest),
      DATABASE_URL: 'https://gt-course-surveys-tst.firebaseio.com'
    },
    archive: {
      CREDENTIAL: firebase.credential.cert(firebaseKeyTest),
      DATABASE_URL: 'https://gt-course-surveys-tst.firebaseio.com'
    }
  }
});
