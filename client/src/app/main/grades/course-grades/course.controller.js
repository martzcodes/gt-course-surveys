(function () {
  'use strict';

  angular
    .module('app.grades.course')
    .controller('GradesCourseController', GradesCourseController);

  /** @ngInject */
  function GradesCourseController($filter, $mdMedia, Grade, Semester, course, grades, semesters, d3, _) {
    var vm = this;
    var translate = $filter('translate');

    // Data

    /**
     * The course for which to display grades.
     *
     * @type {!Course}
     */
    vm.course = course;

    /**
     * Course grades across semesters.
     *
     * @type {!Array<SemesterGrades>}
     */
    vm.grades = _.omit(grades, 'all');

    /**
     * All semesters.
     *
     * @type {!Array<Semester>}
     */
    vm.semesters = _.reject(semesters, Semester.isUnknown);

    /**
     * Display mode. One of ['#', '%', '~'].
     *
     * @type {string}
     */
    vm.mode = '%';

    /**
     * Chart options.
     *
     * @type {object}
     */
    vm.options = getChartOptions();

    /**
     * Chart data.
     *
     * @type {object};
     */
    vm.data = getChartData();

    // Methods

    vm.refresh = refresh;

    //////////

    /**
     * Refreshes chart state.
     */
    function refresh() {
      vm.options = getChartOptions();

      vm.data = getChartData();
    }

    /**
     * Gets the chart options.
     *
     * @return {object}
     * @private
     */
    function getChartOptions() {
      var isLargeDisplay = $mdMedia('gt-md');

      var options = {
        chart: {
          type: 'multiBarChart',
          height: 600,
          margin: {
            top: 24,
            right: 0,
            bottom: isLargeDisplay ? 36 : 24,
            left: 48
          },
          clipEdge: true,
          duration: 500,
          stacked: true,
          showControls: isLargeDisplay,
          controlLabels: {
            grouped: translate('COURSE_GRADES.GROUPED'),
            stacked: translate('COURSE_GRADES.STACKED')
          },
          showLegend: isLargeDisplay,
          legend: {
            margin: {
              top: 6,
              right: 0,
              bottom: 18,
              left: 0
            }
          },
          showXAxis: isLargeDisplay,
          xAxis: {
            showMaxMin: false
          },
          yAxis: {
            axisLabelDistance: -20,
            tickFormat: function (d) {
              if (vm.mode === '#') {
                return d3.format(',f')(d);
              } else {
                return d3.format(',f')(d) + '%';
              }
            }
          }
        }
      };

      if (vm.mode === '#') {
        var max = _.chain(vm.grades).map(function (semesterGrades) {
          return _.get(semesterGrades, ['#', 't'], 0);
        }).max().divide(100).ceil().multiply(100).value();

        options.chart.forceY = [0, max];
      } else {
        options.chart.forceY = [0, 100];
      }

      return options;
    }

    /**
     * Gets the chart data.
     *
     * @return {object}
     * @private
     */
    function getChartData() {
      var data = [];

      var keys = Grade.none()[vm.mode];
      _.forEach(_.keys(keys).sort(), function (key) {
        if (key === 't') {
          return;
        }

        data.push({
          key: _.toUpper(key),
          values: _.map(vm.semesters, function (semester) {
            return {
              x: semester.name,
              y: _.get(vm.grades, [semester.id, vm.mode, key], 0)
            };
          })
        });
      });

      return data;
    }
  }
})();
