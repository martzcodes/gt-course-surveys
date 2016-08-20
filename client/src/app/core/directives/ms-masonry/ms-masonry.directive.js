(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('msMasonryController', msMasonryController)
    .directive('msMasonry', msMasonry)
    .directive('msMasonryItem', msMasonryItem);

  /** @ngInject */
  function msMasonryController($scope, $window, $mdMedia, $timeout) {
    var vm = this,
        defaultOpts = {
          columnCount: 5,
          respectItemOrder: false,
          reLayoutDebounce: 400,
          responsive: {
            md: 3,
            sm: 2,
            xs: 1
          }
        },
        reLayoutTimeout = true;

    vm.options = null;
    vm.container = [];
    vm.containerPos = '';
    vm.columnWidth = '';
    vm.items = [];

    // Methods
    vm.reLayout = reLayout;
    vm.initialize = initialize;
    vm.waitImagesLoaded = waitImagesLoaded;

    function initialize() {
      vm.options = !vm.options ? defaultOpts : angular.extend(defaultOpts, vm.options);

      watchContainerResize();
    }

    $scope.$on('msMasonry:relayout', function () {
      reLayout();
    });

    function waitImagesLoaded(element, callback) {
      if (typeof imagesLoaded !== 'undefined') {
        var imgLoad = $window.imagesLoaded(element);

        imgLoad.on('done', function () {
          callback();
        });
      } else {
        callback();
      }
    }

    function watchContainerResize() {
      $scope.$watch(
        function () {
          return vm.container.width();
        },
        function (newValue, oldValue) {
          if (newValue !== oldValue) {
            reLayout();
          }
        }
      );
    }

    function reLayout() {
      // Debounce for relayout
      if (reLayoutTimeout) {
        $timeout.cancel(reLayoutTimeout);
      }

      reLayoutTimeout = $timeout(function () {
        start();

        $scope.$broadcast('msMasonry:relayoutFinished');
      }, vm.options.reLayoutDebounce);

      // Start relayout
      function start() {
        vm.containerPos = vm.container[0].getBoundingClientRect();

        updateColumnOptions();

        $scope.$broadcast('msMasonry:relayoutStarted');

        vm.items = vm.container.find('ms-masonry-item');

        //initialize lastRowBottomArr
        var referenceArr = Array.apply(null, new Array(vm.columnCount))
          .map(function () {
            return 0;
          });

        // set item positions
        for (var i = 0; i < vm.items.length; i++) {
          var item = vm.items[i],
            xPos, yPos, column, refTop;

          item = angular.element(item);

          if (item.scope()) {
            item.scope()
              .$broadcast('msMasonryItem:startReLayout');
          }

          item.css({
            'width': vm.columnWidth
          });

          if (vm.options.respectItemOrder) {
            column = i % vm.columnCount;
            refTop = referenceArr[column];
          } else {
            refTop = Math.min.apply(Math, referenceArr);
            column = referenceArr.indexOf(refTop);
          }

          referenceArr[column] = refTop + item[0].getBoundingClientRect()
            .height;

          xPos = Math.round(column * vm.columnWidth);
          yPos = refTop;

          item.css({
            'transform': 'translate3d(' + xPos + 'px,' + yPos + 'px,0px)'
          });
          item.addClass('placed');

          if (item.scope()) {
            item.scope()
              .$broadcast('msMasonryItem:finishReLayout');
          }
        }
      }
    }

    function updateColumnOptions() {
      vm.columnCount = vm.options.columnCount;

      if ($mdMedia('gt-md')) {
        vm.columnCount = vm.options.columnCount;
      } else if ($mdMedia('md')) {
        vm.columnCount = (vm.columnCount > vm.options.responsive.md ? vm.options.responsive.md : vm.columnCount);
      } else if ($mdMedia('sm')) {
        vm.columnCount = (vm.columnCount > vm.options.responsive.sm ? vm.options.responsive.sm : vm.columnCount);
      } else {
        vm.columnCount = vm.options.responsive.xs;
      }

      vm.columnWidth = vm.containerPos.width / vm.columnCount;
    }
  }

  /** @ngInject */
  function msMasonry($timeout) {
    return {
      restrict: 'AEC',
      controller: 'msMasonryController',
      compile: compile
    };

    function compile(element, attributes) {
      return {
        pre: function preLink(scope, iElement, iAttrs, controller) {
          controller.options = angular.fromJson(attributes.options || '{}');
          controller.container = element;
        },
        post: function postLink(scope, iElement, iAttrs, controller) {
          $timeout(function () {
            controller.initialize();
          });
        }
      };
    }
  }

  /** @ngInject */
  function msMasonryItem() {
    return {
      restrict: 'AEC',
      require: '^msMasonry',
      priority: 1,
      link: link
    };

    function link(scope, element, attributes, controller) {
      controller.waitImagesLoaded(element, function () {
        controller.reLayout();
      });

      scope.$on('msMasonryItem:finishReLayout', function () {
        scope.$watch(function () {
          return element.height();
        }, function (newVal, oldVal) {
          if (newVal !== oldVal) {
            controller.reLayout();
          }
        });
      });

      element.on('$destroy', function () {
        controller.reLayout();
      });
    }
  }
})();
