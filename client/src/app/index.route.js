(function () {
  'use strict';

  angular
    .module('app')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    // $urlRouterProvider.when('/', '/reviews');
    $urlRouterProvider.when('/reviews', '/about/faq');
    $urlRouterProvider.when('/reviews/{path:.*}', '/about/faq');
    $urlRouterProvider.when('/grades', '/about/faq');
    $urlRouterProvider.when('/grades/{path:.*}', '/about/faq');
    $urlRouterProvider.when('/', '/about/faq');
    $urlRouterProvider.otherwise('/404');

    let $cookies;
    angular.injector(['ngCookies']).invoke(['$cookies', function (_$cookies_) {
      $cookies = _$cookies_;
    }]);

    const layoutStyle = $cookies.get('ls') || 'verticalNavigation';

    const layouts = {
      verticalNavigation: {
        main: 'app/core/layouts/vertical-navigation.html',
        toolbar: 'app/toolbar/layouts/vertical-navigation/toolbar.html',
        navigation: 'app/navigation/layouts/vertical-navigation/navigation.html'
      },
      verticalNavigationFullwidthToolbar: {
        main: 'app/core/layouts/vertical-navigation-fullwidth-toolbar.html',
        toolbar: 'app/toolbar/layouts/vertical-navigation-fullwidth-toolbar/toolbar.html',
        navigation: 'app/navigation/layouts/vertical-navigation/navigation.html'
      },
      verticalNavigationFullwidthToolbar2: {
        main: 'app/core/layouts/vertical-navigation-fullwidth-toolbar-2.html',
        toolbar: 'app/toolbar/layouts/vertical-navigation-fullwidth-toolbar-2/toolbar.html',
        navigation: 'app/navigation/layouts/vertical-navigation-fullwidth-toolbar-2/navigation.html'
      },
      contentOnly: {
        main: 'app/core/layouts/content-only.html',
        toolbar: '',
        navigation: ''
      },
      contentWithToolbar: {
        main: 'app/core/layouts/content-with-toolbar.html',
        toolbar: 'app/toolbar/layouts/content-with-toolbar/toolbar.html',
        navigation: ''
      }
    };

    $stateProvider.state('app', {
      abstract: true,
      views: {
        'main@': {
          templateUrl: layouts[layoutStyle].main,
          controller: 'MainController as vm'
        },
        'toolbar@app': {
          templateUrl: layouts[layoutStyle].toolbar,
          controller: 'ToolbarController as vm',
          resolve: {
            user: (Auth) => Auth.waitForUser()
          }
        },
        'navigation@app': {
          templateUrl: layouts[layoutStyle].navigation,
          controller: 'NavigationController as vm'
        },
        'quickPanel@app': {
          templateUrl: 'app/quick-panel/quick-panel.html',
          controller: 'QuickPanelController as vm',
          resolve: {
            reviews: (Review) => Review.getRecent()
          }
        }
      }
    });
  }
})();
