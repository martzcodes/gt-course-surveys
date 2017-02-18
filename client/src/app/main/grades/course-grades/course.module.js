(function () {
  'use strict';

  angular
    .module('app.main.grades.course', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider) {
    $stateProvider.state('app.main_grades_course', {
      url: '/grades/:id',
      views: {
        'content@app': {
          templateUrl: 'app/main/grades/course-grades/course.html',
          controller: 'GradesCourseController as vm'
        }
      },
      resolve: {
        course: ($stateParams, Course) => Course.get($stateParams.id),
        grades: ($stateParams, Grade) => Grade.get($stateParams.id),
        semesters: (Semester) => Semester.all()
      },
      bodyClass: 'main-grades-course'
    });

    msNavigationServiceProvider.saveItem('app_main_grades.course', {
      title: 'Course Grades',
      icon: 'icon-view-list',
      weight: 3.2
    });
  }
})();
