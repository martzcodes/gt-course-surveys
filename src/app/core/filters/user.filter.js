(function () {
    'use strict';

    angular
        .module('app.core.filters')
        .filter('user', user);

    /* @ngInject */
    function user($filter, userService, authService, _) {
        return userFilter;

        ////////////////

        function userFilter(id, property) {
            var user = userService.getByIdSync(id);

            if (_.isEmpty(user) || shouldMaskInformationOf(user)) {
                if (_.eq(property, 'name')) {
                    return $filter('translate')('USER.ANONYMOUS');
                }
                if (_.eq(property, 'profileImageUrl')) {
                    // TODO: select avatar based on user ID (in range 1:6)
                    return 'assets/images/avatars/avatar-5.png';
                }
                return null;
            }

            if (_.eq(property, 'profileImageUrl') && _.isEmpty(user.profileImageUrl)) {
                return 'assets/images/avatars/avatar-5.png';
            }

            return user[property] || null;
        }

        function shouldMaskInformationOf(user) {
            var authData = authService.$getAuth();

            // do not mask the currently authenticated user
            if (!_.isEmpty(authData) && _.eq(user.$id, authData.uid)) {
                return false;
            }

            // otherwise, mask based on user preference
            return user.anonymous || false;
        }
    }
})();
