(function () {
  'use strict';

  angular
    .module('app.core')
    .filter('gtGravatarUrl', gtGravatarUrlFilter)
    .filter('gtSpecialization', gtSpecializationFilter)
    .filter('gtDifficulty', gtDifficultyFilter)
    .filter('gtWorkload', gtWorkloadFilter)
    .filter('gtRating', gtRatingFilter);

  /** @ngInject */
  function gtGravatarUrlFilter($filter) {
    var md5 = $filter('md5');

    return function (email) {
      return 'https://www.gravatar.com/avatar/' + md5(email) + '?s=200&d=mm';
    };
  }

  /** @ngInject */
  function gtSpecializationFilter() {
    var values = [
      'Computational Perception & Robotics',
      'Computing Systems',
      'Interactive Intelligence',
      'Machine Learning'
    ];

    return function (specialization) {
      return values[specialization] || '';
    };
  }

  /** @ngInject */
  function gtDifficultyFilter(_) {
    return function (difficulty) {
      if (_.includes([1,2,3,4,5], difficulty)) {
        return 'CORE.DIFFICULTY.' + toLetter(difficulty);
      } else {
        return '';
      }
    };
  }

  /** @ngInject */
  function gtWorkloadFilter(_) {
    return function (workload) {
      if (workload === 1) {
        return 'CORE.HOUR_PER_WEEK';
      } else if (_.isNumber(workload) && workload >= 0) {
        return 'CORE.HOURS_PER_WEEK';
      } else {
        return '';
      }
    };
  }

  /** @ngInject */
  function gtRatingFilter(_) {
    return function (rating) {
      if (_.includes([1,2,3,4,5], rating)) {
        return 'CORE.RATING.' + toLetter(rating);
      } else {
        return '';
      }
    };
  }

  /**
   * Maps numbers to letters:
   *
   * 1 -> A
   * 2 -> B
   * ...
   *
   * @param {number} number
   * @return {string} Character.
   * @private
   */
  function toLetter(number) {
    return String.fromCharCode(64 + number);
  }
})();
