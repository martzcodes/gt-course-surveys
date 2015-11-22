angular.module('surveyor').filter('difficulty',
  function () {
    return function (difficultyLevel) {
      switch (difficultyLevel) {
        case 1:  return 'Very Easy';
        case 2:  return 'Easy';
        case 3:  return 'Moderate';
        case 4:  return 'Hard';
        case 5:  return 'Very Hard';
        default: return '';
      }
    };
  }
);