'use strict';

import firebase from 'firebase-admin';
import firebaseConfig from '../../config/firebase';
import FirebaseEnum from '../enum/firebase';

class Database {
  constructor(app) {
    this._app = app;
  }

  get(location) {
    return this._app.database().ref(location).once(FirebaseEnum.Event.Value);
  }

  set(location, toWhat) {
    return this._app.database().ref(location).set(toWhat);
  }

  update(location, withWhat) {
    return this._app.database().ref(location).update(withWhat);
  }

  remove(location) {
    return this._app.database().ref(location).remove();
  }

  ref(location) {
    if (location) {
      return this._app.database().ref(location);
    }
    return this._app.database().ref();
  }
}

export const archive = new Database(
  firebase.initializeApp({
    credential: firebaseConfig.archive.CREDENTIAL,
    databaseURL: firebaseConfig.archive.DATABASE_URL
  }, 'archive')
);

const NormalDatabase = new Database(
  firebase.initializeApp({
    credential: firebaseConfig.normal.CREDENTIAL,
    databaseURL: firebaseConfig.normal.DATABASE_URL
  }, 'normal')
);

export default NormalDatabase;
