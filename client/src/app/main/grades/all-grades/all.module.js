(function () {
  'use strict';

  angular
    .module('app.main.grades.all', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider) {
    $stateProvider.state('app.main_grades_all', {
      url: '/grades',
      views: {
        'content@app': {
          templateUrl: 'app/main/grades/all-grades/all.html',
          controller: 'GradesAllController as vm'
        }
      },
      resolve: {
        courses: (Course) => Course.all(),
        grades: (Grade) => Grade.all()
      },
      bodyClass: 'main-grades-all'
    });

    msNavigationServiceProvider.saveItem('app_main_grades.all', {
      title: 'All Grades',
      icon: 'icon-table-large',
      state: 'app.main_grades_all',
      weight: 3.1
    });
  }
})();
