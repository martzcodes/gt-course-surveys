(function () {
  'use strict';

  angular
    .module('app.main.grades.course')
    .controller('GradesCourseController', GradesCourseController);

  /** @ngInject */
  function GradesCourseController($mdMedia, Grade, Semester, course, grades, semesters) {
    const vm = this;

    // Data

    vm.course = course;
    vm.grades = _.omit(grades, 'all');
    vm.semesters = _.reject(semesters, Semester.isUnknown);
    vm.mode = '%';
    vm.options = _getChartOptions();
    vm.data = _getChartData();

    // Methods

    vm.refresh = refresh;

    //////////

    function refresh() {
      vm.options = _getChartOptions();
      vm.data = _getChartData();
    }

    function _getChartOptions() {
      const isLargeDisplay = $mdMedia('gt-md');

      const options = {
        chart: {
          type: 'multiBarChart',
          height: 600,
          margin: {
            top: 48,
            right: 12,
            bottom: isLargeDisplay ? 36 : 12,
            left: 48
          },
          clipEdge: true,
          duration: 500,
          stacked: true,
          showControls: isLargeDisplay,
          controlLabels: {
            grouped: 'Grouped',
            stacked: 'Stacked'
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
            tickFormat(d) {
              if (vm.mode === '#') {
                return d3.format(',f')(d);
              }
              return `${d3.format(',f')(d)}%`;
            }
          }
        }
      };

      if (vm.mode === '#') {
        const max = _.chain(vm.grades)
          .map((semesterGrades) => _.get(semesterGrades, ['#', 't'], 0))
          .max()
          .divide(100)
          .ceil()
          .multiply(100)
          .value();

        options.chart.forceY = [0, max];
      } else {
        options.chart.forceY = [0, 100];
      }

      return options;
    }

    function _getChartData() {
      const data = [];

      const keys = Grade.none()[vm.mode];
      _.forEach(_.keys(keys).sort(), (key) => {
        if (key === 't') {
          return;
        }

        data.push({
          key: _.toUpper(key),
          values: _.map(vm.semesters, (semester) => ({
            x: semester.name,
            y: _.get(vm.grades, [semester._id, vm.mode, key], 0)
          }))
        });
      });

      return data;
    }
  }
})();
