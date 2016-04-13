(function () {
    'use strict';

    angular
        .module('app.components.reviews')
        .config(componentConfig);

    /* @ngInject */
    function componentConfig($translatePartialLoaderProvider, $stateProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/components/reviews');

        $stateProvider
        .state('triangular.admin-default.reviews', {
            abstract: true,
            templateUrl: 'app/components/reviews/layouts/reviews.tmpl.html'
        })
        .state('triangular.admin-default.reviews.all', {
            url: '/reviews/all',
            templateUrl: 'app/components/reviews/all/all.tmpl.html',
            controller: 'AllReviewsController',
            controllerAs: 'vm',
            resolve: {
                courses: requireCourses
            }
        })
        .state('triangular.admin-default.reviews-course', {
            url: '/reviews/course/{id}',
            views: {
                '': {
                    templateUrl: 'app/components/reviews/course/course.tmpl.html',
                    controller: 'CourseReviewsController',
                    controllerAs: 'vm',
                    resolve: {
                        reviews: requireReviewsForCourse,
                        auth: waitForAuth,
                        users: requireUsers,
                        courses: requireCourses,
                        semesters: requireSemesters
                    }
                },
                belowContent: {
                    templateUrl: 'app/components/reviews/compose/compose.tmpl.html',
                    controller: 'ComposeReviewController',
                    controllerAs: 'vm',
                    resolve: {
                        reviews: requireReviewsForCourse,
                        auth: waitForAuth
                    }
                }
            }
        })
        .state('triangular.admin-default.reviews.my', {
            url: '/reviews/my',
            templateUrl: 'app/components/reviews/my/my.tmpl.html',
            controller: 'MyReviewsController',
            controllerAs: 'vm',
            resolve: {
                reviews: requireReviewsForCurrentUser,
                auth: requireAuth,
                users: requireUsers,
                courses: requireCourses,
                semesters: requireSemesters
            }
        });

        triMenuProvider.addMenu({
            name: 'MENU.REVIEWS.ALL',
            icon: 'zmdi zmdi-comments',
            type: 'link',
            state: 'triangular.admin-default.reviews.all',
            priority: 3.0
        });
    }

    /* @ngInject */
    function waitForAuth(authService) {
        return authService.$waitForAuth();
    }

    /* @ngInject */
    function requireAuth(authService) {
        return authService.$requireAuth();
    }

    /* @ngInject */
    function requireUsers(userService) {
        return userService.getUsers();
    }

    /* @ngInject */
    function requireCourses(courseService) {
        return courseService.getCourses();
    }

    /* @ngInject */
    function requireSemesters(semesterService) {
        return semesterService.getSemesters();
    }

    /* @ngInject */
    function requireReviewsForCourse($stateParams, reviewService) {
        return reviewService.getReviewsForCourse($stateParams.id || null);
    }

    /* @ngInject */
    function requireReviewsForCurrentUser(reviewService, authService) {
        return reviewService.getReviewsForAuthor((authService.$getAuth() || {}).uid || null);
    }
})();
