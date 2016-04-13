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
            getByIdSync: getByIdSync,

            create: create,
            save: save
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

        function getByIdSync(id) {
            var self = this;

            return self.users ? self.users.$getRecord(id) : null;
        }

        function create(authData) {
            var providerData = authData[authData.provider];
            var userRef = databaseService.child('users').child(authData.uid);

            return $q(function (resolve, reject) {
                userRef.once('value', function (user) {
                    if (user.exists()) {
                        return resolve(user.val());
                    } else {
                        user = {
                            created: moment.utc().format(),
                            name: providerData.displayName || providerData.email.split('@')[0].replace(/\./g, ' '),
                            email: providerData.email || null,
                            profileImageUrl: providerData.profileImageURL,
                            authProvider: authData.provider,
                            anonymous: false
                        };
                        userRef.set(user, function (error) {
                            if (error) {
                                return reject(error);
                            } else {
                                slackService.postNotification([
                                    'sign-up: ',
                                    user.name,
                                    ' (', user.authProvider, ')'
                                ].join(''));
                                return resolve(user);
                            }
                        });
                    }
                }, reject);
            });
        }

        function save(user) {
            var self = this;

            if (_.isNull(self.users)) {
                return $q.reject({ message: 'Invalid operation.' });
            }

            return self.users.$save(user);
        }
    }
})();
