angular.module('surveyor').config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'assets/templates/reviews.html',
      controller: 'ReviewsController'
    })
    
    .when('/reviews', {
      templateUrl: 'assets/templates/reviews.html',
      controller: 'ReviewsController'
    })

    .when('/my-reviews', {
      templateUrl: 'assets/templates/myReviews.html',
      controller: 'MyReviewsController'
    })

    .when('/grades', {
      templateUrl: 'assets/templates/grades.html',
      controller: 'GradesController'
    })

    .when('/write-review', {
      templateUrl: 'assets/templates/writeReview.html',
      controller: 'WriteReviewController'
    })

    .when('/sign-up', {
      templateUrl: 'assets/templates/sign-up.html',
      controller: 'SignUpController'
    })

    .when('/sign-in', {
      templateUrl: 'assets/templates/sign-in.html',
      controller: 'SignInController'
    })
    .when('/sign-in/:email', {
      templateUrl: 'assets/templates/sign-in.html',
      controller: 'SignInController'
    })

    .when('/password', {
      templateUrl: 'assets/templates/password.html',
      controller: 'PasswordController'
    })

    .when('/course/:id', {
      templateUrl: 'assets/templates/course.html',
      controller: 'CourseController'
    })

    .when('/account', {
      templateUrl: 'assets/templates/account.html',
      controller: 'AccountController'
    })

    .when('/faq', {
      templateUrl: 'assets/templates/faq.html',
      controller: 'FaqController'
    })

    .when('/error', {
      templateUrl: 'assets/templates/error.html',
      controller: 'ErrorController'
    })
    
    .otherwise('/error');
});