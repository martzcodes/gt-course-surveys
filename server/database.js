'use strict';

var q = require('q');
var firebase = require('firebase');

firebase.initializeApp({
  serviceAccount: __dirname + '/firebase-key.json',
  databaseURL: 'https://' + process.env.FIREBASE_ENV + '.firebaseio.com'
});

/**
 * Reads data from a location.
 *
 * @param {string} location
 * @return {!Promise()}
 */
function get(location) {
  return q(firebase.database().ref(location).once('value'));
}

/**
 * Sets data at a location.
 *
 * @param {string} location
 * @param {object|string|number|boolean|null} toWhat
 * @return {!Promise()}
 */
function set(location, toWhat) {
  return q(firebase.database().ref(location).set(toWhat));
}

/**
 * Updates data at a location.
 *
 * @param {string} location
 * @param {object|string|number|boolean|null} toWhat
 * @return {!Promise()}
 */
function update(location, withWhat) {
  return q(firebase.database().ref(location).update(withWhat));
}

/**
 * Deletes data at a location.
 *
 * @param {string} location
 * @return {!Promise()}
 */
function remove(location) {
  return q(firebase.database().ref(location).remove());
}

/**
 * Returns a reference to a location.
 *
 * @param {string=} location
 * @return {!Ref}
 */
function ref(location) {
  return location ? firebase.database().ref(location) : firebase.database().ref();
}

// EXPORTS

module.exports = {
  get: get,
  set: set,
  update: update,
  remove: remove,
  ref: ref
};
