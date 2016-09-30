(function () {
  'use strict';

  angular
    .module('app.grades.all', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
    $stateProvider.state('app.grades_all', {
      url: '/grades',
      views: {
        'content@app': {
          templateUrl: 'app/main/grades/all-grades/all.html',
          controller: 'GradesAllController as vm'
        }
      },
      resolve: {
        courses: function (Course) {
          return Course.all();
        },
        grades: function (Grade) {
          return Grade.all();
        }
      },
      bodyClass: 'grades-all'
    });

    $translatePartialLoaderProvider.addPart('app/main/grades/all-grades');

    msNavigationServiceProvider.saveItem('grades.all', {
      title: 'All Grades',
      translate: 'ALL_GRADES.NAV',
      icon: 'icon-table-large',
      state: 'app.grades_all',
      weight: 3.1
    });
  }
})();
