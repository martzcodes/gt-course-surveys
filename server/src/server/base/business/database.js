'use strict';

import firebase from 'firebase-admin';
import firebaseConfig from '../../config/firebase';
import FirebaseEnum from '../enums/firebase';

firebase.initializeApp({
  credential: firebaseConfig.CREDENTIAL,
  databaseURL: firebaseConfig.DATABASE_URL
});

class Database {
  static get(location) {
    return firebase.database().ref(location).once(FirebaseEnum.Event.Value);
  }

  static set(location, toWhat) {
    return firebase.database().ref(location).set(toWhat);
  }

  static update(location, withWhat) {
    return firebase.database().ref(location).update(withWhat);
  }

  static remove(location) {
    return firebase.database().ref(location).remove();
  }

  static ref(location) {
    if (location) {
      return firebase.database().ref(location);
    }
    return firebase.database().ref();
  }
}

export default Database;
