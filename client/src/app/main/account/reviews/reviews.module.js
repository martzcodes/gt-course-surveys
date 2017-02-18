(function () {
  'use strict';

  angular
    .module('app.main.account.reviews', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider) {
    $stateProvider.state('app.main_account_reviews', {
      url: '/account/reviews',
      views: {
        'content@app': {
          templateUrl: 'app/main/account/reviews/reviews.html',
          controller: 'MyReviewsController as vm'
        }
      },
      resolve: {
        user: (Auth) => Auth.requireUser(),
        reviews: (Review) => Review.getByCurrentUser()
      },
      bodyClass: 'main-account-reviews'
    });

    msNavigationServiceProvider.saveItem('app_main_account.reviews', {
      title: 'My Reviews',
      icon: 'icon-view-list',
      state: 'app.main_account_reviews',
      weight: 1.2
    });
  }
})();
