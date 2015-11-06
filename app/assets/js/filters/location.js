angular.module('surveyor').filter('location',
  function () {
    return function (coordinates) {
      if (coordinates) {
        return [ coordinates.latitude, coordinates.longitude ].join(', ');
      }
      else {
        return '';
      }
    };
  }
);