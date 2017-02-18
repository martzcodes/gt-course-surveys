(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Grade', Grade);

  /** @ngInject */
  function Grade(CacheFactory, Util) {
    const ini = 'GRD';
    const cache = CacheFactory(ini);

    const service = {
      all,
      get,
      none
    };

    return service;

    //////////

    async function all() {
      if (cache.get('all')) {
        return cache.get('all');
      }

      const snapshot = await firebase.database().ref(ini).once('value');
      const grades = _denormalize(snapshot.val());

      return cache.put('all', grades);
    }

    async function get(id) {
      const cached = _.get(cache.get('all'), id);
      if (cached) {
        return cached;
      }
      return _.get(await all(), id, null);
    }

    function _denormalize(grades) {
      let total = 0;
      let totalWithoutWithdrawals = 0;
      let counts = {};

      // For each course's grades...
      _.forEach(grades, (courseGrades, courseId) => {
        // For each semester's grades...
        _.forEach(courseGrades, (semesterGrades, semesterId) => {
          total = semesterGrades.t;
          totalWithoutWithdrawals = total - semesterGrades.w;

          grades[courseId][semesterId] = {
            '#': semesterGrades,
            '%': _.chain(semesterGrades).map((value, key) => [key, Util.percent(value, total)]).fromPairs().assign({ t: 100 }).value(),
            '~': _.chain(semesterGrades).map((value, key) => [key, Util.percent(value, totalWithoutWithdrawals)]).fromPairs().assign({ t: 100, w: 0 }).value()
          };
        });

        // Combined across all semesters stored under 'all' for a given course...
        counts = _.reduce(grades[courseId], (all, current) => _.isEmpty(all) ? current['#'] : _.mapValues(all, (value, key) => value + current['#'][key]), {});

        total = _.reduce(counts, (sum, count, key) => sum + (key === 't' ? 0 : count));

        totalWithoutWithdrawals = _.reduce(counts, (sum, count, key) => sum + (key === 't' || key === 'w' ? 0 : count));

        grades[courseId].all = {
          '#': counts,
          '%': _.chain(counts).map((value, key) => [key, Util.percent(value, total)]).fromPairs().assign({ t: 100 }).value(),
          '~': _.chain(counts).map((value, key) => [key, Util.percent(value, totalWithoutWithdrawals)]).fromPairs().assign({ t: 100, w: 0 }).value()
        };
      });

      return grades;
    }

    function none() {
      return {
        '#': { a: 0, b: 0, c: 0, d: 0, f: 0, i: 0, s: 0, u: 0, v: 0, w: 0, t: 0 },
        '%': { a: 0, b: 0, c: 0, d: 0, f: 0, i: 0, s: 0, u: 0, v: 0, w: 0, t: 0 },
        '~': { a: 0, b: 0, c: 0, d: 0, f: 0, i: 0, s: 0, u: 0, v: 0, w: 0, t: 0 }
      };
    }
  }
})();
