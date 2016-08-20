(function () {
  'use strict';

  angular
    .module('app.grades', [
      'app.grades.all',
      'app.grades.course'
    ])
    .config(config);

  /** @ngInject */
  function config($translatePartialLoaderProvider, msNavigationServiceProvider) {
    $translatePartialLoaderProvider.addPart('app/main/grades');

    msNavigationServiceProvider.saveItem('grades', {
      title: 'Grades',
      translate: 'GRADES.NAV',
      group: true,
      weight: 3
    });
  }
})();
