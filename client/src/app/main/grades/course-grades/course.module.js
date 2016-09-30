(function () {
  'use strict';

  angular
    .module('app.grades.course', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
    $stateProvider.state('app.grades_course', {
      url: '/grades/:id',
      views: {
        'content@app': {
          templateUrl: 'app/main/grades/course-grades/course.html',
          controller: 'GradesCourseController as vm'
        }
      },
      resolve: {
        course: function ($stateParams, Course) {
          return Course.get($stateParams.id);
        },
        grades: function ($stateParams, Grade) {
          return Grade.get($stateParams.id);
        },
        semesters: function (Semester) {
          return Semester.all();
        }
      },
      bodyClass: 'grades-course'
    });

    $translatePartialLoaderProvider.addPart('app/main/grades/course-grades');

    msNavigationServiceProvider.saveItem('grades.course', {
      title: 'Course Grades',
      translate: 'COURSE_GRADES.NAV',
      icon: 'icon-view-list',
      weight: 3.2
    });
  }
})();
