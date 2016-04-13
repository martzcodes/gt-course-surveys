(function () {
    'use strict';

    angular
        .module('app.components.reviews')
        .run(runFunction);

    /* @ngInject */
    function runFunction($rootScope, $filter, triMenu, authService, courseService, utilService, _) {
        var destroyers = [];

        destroyers.push(authService.$onAuth(function (authData) {
            if (authData) {
                triMenu.addMenu({
                    name: 'MENU.REVIEWS.MY',
                    icon: 'zmdi zmdi-comment',
                    type: 'link',
                    state: 'triangular.admin-default.reviews.my',
                    priority: 2.0
                });
            } else {
                triMenu.removeMenu('triangular.admin-default.reviews.my');
            }
        }));

        $rootScope.$on('$destroy', function () {
            angular.forEach(destroyers, function (d) {
                d();
            });
        });

        courseService.getCourses()
        .then(function (courses) {
            triMenu.removeMenu('courses');
            triMenu.addMenu({
                name: 'MENU.REVIEWS.COURSE',
                icon: 'zmdi zmdi-graduation-cap',
                type: 'dropdown',
                state: 'courses',
                priority: 4.0,
                children: _.map(courses, function (course) {
                    var caption = $filter('course')(course.$id, 'menuCaption');
                    return {
                        name: caption,
                        tooltip: !utilService.isMobile() && caption.length > 30 ? caption : null,
                        state: 'triangular.admin-default.reviews-course',
                        type: 'link',
                        params: {
                            id: course.$id
                        }
                    };
                })
            });
        });
    }
})();
