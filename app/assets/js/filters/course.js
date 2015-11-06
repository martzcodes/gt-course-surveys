angular.module('surveyor').filter('course',
  function () {
    return function (course, dflt) {
      if (course && course.department) {
        return course.department + ' ' +
          course.number + (course.section ? '-' + course.section : '') + ' ' +
          course.name;
      }
      else {
        return dflt || course;
      }
    };
  }
);