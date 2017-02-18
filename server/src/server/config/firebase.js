'use strict';

import firebase from 'firebase-admin';
import firebaseKeyLocal from './keys/firebase/local.json';
import firebaseKeyProduction from './keys/firebase/production.json';
import firebaseKeyStaging from './keys/firebase/staging.json';
import firebaseKeyTest from './keys/firebase/test.json';
import Export from './export';

export default Export({
  local: {
    CREDENTIAL: firebase.credential.cert(firebaseKeyLocal),
    DATABASE_URL: 'https://gt-course-surveys-dev.firebaseio.com'
  },
  staging: {
    CREDENTIAL: firebase.credential.cert(firebaseKeyStaging),
    DATABASE_URL: 'https://gt-course-surveys-dev.firebaseio.com'
  },
  production: {
    CREDENTIAL: firebase.credential.cert(firebaseKeyProduction),
    DATABASE_URL: 'https://gt-surveyor.firebaseio.com'
  },
  test: {
    CREDENTIAL: firebase.credential.cert(firebaseKeyTest),
    DATABASE_URL: 'https://gt-course-surveys-tst.firebaseio.com'
  }
});
