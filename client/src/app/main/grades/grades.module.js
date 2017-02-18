(function () {
  'use strict';

  angular
    .module('app.main.grades', [
      'app.main.grades.all',
      'app.main.grades.course'
    ])
    .config(config);

  /** @ngInject */
  function config(msNavigationServiceProvider) {
    msNavigationServiceProvider.saveItem('app_main_grades', {
      title: 'Grades',
      group: true,
      weight: 3
    });
  }
})();
