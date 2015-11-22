angular.module('surveyor').filter('specialization',
  function () {
    return function (specialization, dflt) {
      switch (specialization) {
        case 0:  return 'Computational Perception & Robotics';
        case 1:  return 'Computing Systems';
        case 2:  return 'Interactive Intelligence';
        case 3:  return 'Machine Learning';
        default: return dflt;
      }
    };
  }
);