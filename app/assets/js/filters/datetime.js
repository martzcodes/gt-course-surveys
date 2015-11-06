angular.module('surveyor').filter('datetime',
  function ($filter) {
    return function (dateTimeString) {
      return $filter('date')(new Date(dateTimeString), 'on MM/dd/yy @ HH:mm:ss');
    };
  }
);