(function () {
    'use strict';

    angular
        .module('app.core.services')
        .factory('userService', userService);

    /* @ngInject */
    function userService($q, $firebaseArray, authService, databaseService, slackService, moment, _) {
        var service = {
            users: null,

            getUsers: getUsers,
            getById: getById,
            getByIdSync: getByIdSync,

            save: save,
            initialize: initialize
        };

        return service;

        ////////////////

        function getUsers() {
            var self = this;

            if (_.isEmpty(authService.$getAuth())) {
                if (!_.isNull(self.users)) {
                    self.users.$destroy();
                    self.users = null;
                }
                return $q.resolve([]);
            }

            if (!_.isNull(self.users)) {
                return self.users.$loaded();
            }

            self.users = new $firebaseArray(databaseService.child('users'));
            return self.users.$loaded();
        }

        function getById(id) {
            var self = this;

            return $q(function (resolve, reject) {
                self.getUsers()
                .then(function () {
                    return resolve(self.getByIdSync(id));
                })
                .catch(reject);
            });
        }

        function getByIdSync(id) {
            var self = this;

            return self.users ? self.users.$getRecord(id) : null;
        }

        function save(user) {
            var self = this;

            if (_.isNull(self.users)) {
                return $q.reject({ message: 'Invalid operation.' });
            }

            return self.users.$save(user);
        }

        function initialize(authData) {
            var self = this;

            return $q(function (resolve, reject) {
                self.getById(authData.uid)
                .then(function (userData) {
                    return _.isNull(userData) ? _create(authData) : _update(userData, authData);
                })
                .then(function (userData) {
                    return resolve(userData);
                })
                .catch(reject);
            });
        }

        // create a brand new user
        function _create(authData) {
            return $q(function (resolve, reject) {
                var userData = {
                    created        : _getNowUtc(),
                    email          : _getEmail(authData),
                    name           : _getName(authData),
                    profileImageUrl: _getProfileImageUrl(authData),
                    authProvider   : _getProvider(authData),
                    anonymous      : false
                };

                databaseService.child('users').child(authData.uid).set(userData, function (error) {
                    if (error) {
                        return reject(error);
                    } else {
                        slackService.postNotification(['sign-up: ', userData.name, ' (', userData.authProvider, ')'].join(''));
                        return resolve(userData);
                    }
                });
            });
        }

        function _getNowUtc() {
            return moment.utc().format();
        }

        function _getProvider(authData) {
            return authData.provider || null;
        }

        function _getProviderData(authData) {
            return authData[_getProvider(authData)] || {};
        }

        function _getEmail(authData) {
            return _getProviderData(authData).email || null;
        }

        function _getName(authData) {
            var name = _getProviderData(authData).displayName;
            if (name) {
                return name;
            }

            var email = _getEmail(authData);
            if (email) {
                return email.split('@')[0].replace(/\./g, ' ');
            }

            return 'Unknown';
        }

        function _getProfileImageUrl(authData) {
            return _getProviderData(authData).profileImageURL || null;
        }

        function _getFirebaseData(userData) {
            return _.pick(userData, [
                'created',
                'email',
                'name',
                'profileImageUrl',
                'authProvider',
                'anonymous',
                'specialization'
            ]);
        }

        // update an existing user with current authentication data (if needed)
        function _update(userData, authData) {
            return $q(function (resolve, reject) {
                // whether to commit an update to the database
                var updateNeeded = false;

                // check profile image url
                var latestProfileImageUrl = _getProviderData(authData).profileImageURL;
                if (!_.eq(userData.profileImageUrl, latestProfileImageUrl)) {
                    userData.profileImageUrl = latestProfileImageUrl;
                    updateNeeded = true;
                }

                // other checks as needed
                // ...

                if (!updateNeeded) {
                    return resolve(userData);
                } else {
                    databaseService.child('users').child(authData.uid).update(_getFirebaseData(userData), function (error) {
                        if (error) {
                            return reject(error);
                        } else {
                            return resolve(userData);
                        }
                    });
                }
            });
        }
    }
})();
