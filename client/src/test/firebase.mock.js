(function () {
  'use strict';

  angular.module('app')
    .run(runBlock);

  /** @ngInject */
  function runBlock($window, $q, _) {
    var firebase = $window.firebase;

    /**
     * Mock database.
     *
     * @type {object}
     */
    firebase.data = {};

    /**
     * Clears the database data.
     */
    firebase.resetData = function () {
      this.data = {};
    };

    /**
     * Constructs a firebase snapshot.
     *
     * @param {*} value
     * @return {!snapshot}
     */
    firebase.snapshot = function (value) {
      return new snapshot(value);
    };

    /**
     * Initializes firebase.
     *
     * @param {object} config
     */
    firebase.initializeApp = function (config) {
      this.config = config;
    };

    /**
     * Constructs a firebase reference.
     *
     * @param {string} location
     * @return {!ref}
     */
    firebase.ref = function (location) {
      return new ref(location);
    };

    /**
     * Gets the firebase database singleton.
     *
     * @return {object}
     */
    firebase.database = function () {
      return {
        ref: firebase.ref
      };
    };

    /**
     * Current user.
     *
     * @type {?object}
     */
    firebase.user = null;

    /**
     * Auth state change callbacks.
     *
     * @type {!Array<function(?object):undefined>}
     */
    firebase.authCallbacks = [];

    /**
     * Gets the firebase auth singleton.
     *
     * @return {object}
     */
    firebase.auth = function () {
      return {
        onAuthStateChanged: function (callback) {
          firebase.authCallbacks.push(callback);
        },

        signInAnonymously:              function () { return $q.resolve(); },
        createUserWithEmailAndPassword: function () { return $q.resolve(); },
        sendPasswordResetEmail:         function () { return $q.resolve(); },
        signInWithEmailAndPassword:     function () { return $q.resolve(); },
        signOut:                        function () { return $q.resolve(); },

        EmailAuthProvider: {
          credential: function () {}
        }
      };
    };

    /**
     * Firebase snapshot.
     *
     * @param {*} value
     * @constructor
     */
    function snapshot(value) {
      this.key = null;
      this.value = value || null;

      if (this.value) {
        var childKeys = _.keys(value);
        if (childKeys.length === 1) {
          this.key = childKeys[0];
          this.value = this.value[this.key];
        }
      }
    }

    snapshot.prototype.exists = function () {
      return this.value !== null;
    };

    snapshot.prototype.val = function () {
      return this.value;
    };

    snapshot.prototype.forEach = function (callback) {
      var self = this;

      _.forEach(_.keys(self.value), function (childKey) {
        callback(new snapshot(_.pick(self.value, childKey)));
      });
    };

    /**
     * Firebase database reference.
     *
     * @param {string} location
     * @constructor
     */
    function ref(location) {
      this.location = ref.check(location);
    }

    ref.check = function (location) {
      if (!_.isString(location) || _.isEmpty(location)) {
        return [];
      }

      var s = _.clone(location);

      if (_.startsWith(s, '/')) {
        s = s.substring(1);
      }

      if (_.endsWith(s, '/')) {
        s = s.substring(0, s.length - 1);
      }

      return s.split('/');
    };

    ref.prototype.path = function () {
      return this.location.join('/');
    };

    ref.prototype.child = function (location) {
      this.location = _.reject(this.location.concat(ref.check(location)), _.isNull);

      return this;
    };

    ref.prototype.once = function () {
      var value = _.get(firebase.data, this.location, null);

      return $q.resolve(firebase.snapshot(_.fromPairs([[_.last(this.location), value]])));
    };

    ref.prototype.set = function (value) {
      _.set(firebase.data, this.location, value || null);

      return $q.resolve(null);
    };

    ref.prototype.update = function (value) {
      return this.set(value);
    };

    ref.prototype.remove = function () {
      _.unset(firebase.data, this.location);

      return $q.resolve();
    };
  }
})();
