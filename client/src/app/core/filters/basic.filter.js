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
    const md5 = $filter('md5');

    return function (email) {
      return `https://www.gravatar.com/avatar/${md5(email)}?s=200&d=mm`;
    };
  }

  /** @ngInject */
  function gtSpecializationFilter() {
    const values = [
      'Computational Perception & Robotics',
      'Computing Systems',
      'Interactive Intelligence',
      'Machine Learning'
    ];

    return function (value) {
      return values[value] || '';
    };
  }

  /** @ngInject */
  function gtDifficultyFilter() {
    const values = [
      '',
      'Very Easy',
      'Easy',
      'Medium',
      'Hard',
      'Very Hard'
    ];

    return function (value) {
      return values[value] || '';
    };
  }

  /** @ngInject */
  function gtWorkloadFilter() {
    return function (workload) {
      if (workload === 1) {
        return 'hour/week';
      }
      if (workload > 1) {
        return 'hours/week';
      }
      return '';
    };
  }

  /** @ngInject */
  function gtRatingFilter() {
    const values = [
      '',
      'Strongly Disliked',
      'Disliked',
      'Neutral',
      'Liked',
      'Loved!'
    ];

    return function (value) {
      return values[value] || '';
    };
  }
})();
