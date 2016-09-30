(function () {
  'use strict';

  angular
    .module('app.account.reviews', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
    $stateProvider.state('app.account_reviews', {
      url: '/account/reviews',
      views: {
        'content@app': {
          templateUrl: 'app/main/account/my-reviews/my.html',
          controller: 'ReviewsMyController as vm'
        }
      },
      resolve: {
        user: function (Auth) {
          return Auth.requireCurrentUserData();
        },
        reviews: function ($q, Auth, Review) {
          var deferred = $q.defer();

          Auth.requireCurrentUser().then(function (user) {
            return Review.getByUser(user.id);
          }).then(deferred.resolve).catch(deferred.reject);

          return deferred.promise;
        }
      },
      bodyClass: 'account-reviews-my'
    });

    $translatePartialLoaderProvider.addPart('app/main/account/my-reviews');

    msNavigationServiceProvider.saveItem('account.reviews', {
      title: 'My Reviews',
      translate: 'MY_REVIEWS.NAV',
      icon: 'icon-view-list',
      state: 'app.account_reviews',
      weight: 1.2
    });
  }
})();
