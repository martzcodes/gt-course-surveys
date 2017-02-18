(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('MsSearchBarController', MsSearchBarController)
    .directive('msSearchBar', msSearchBarDirective);

  /** @ngInject */
  function MsSearchBarController($scope, $element, $timeout) {
    const vm = this;

    // Data
    vm.collapsed = true;
    vm.query = '';
    vm.queryOptions = {
      debounce: vm.debounce || 0
    };
    vm.resultsLoading = false;
    vm.results = null;
    vm.selectedResultIndex = 0;
    vm.ignoreMouseEvents = false;

    // Methods
    vm.populateResults = populateResults;

    vm.expand = expand;
    vm.collapse = collapse;

    vm.absorbEvent = absorbEvent;
    vm.handleKeydown = handleKeydown;
    vm.handleMouseenter = handleMouseenter;
    vm.temporarilyIgnoreMouseEvents = temporarilyIgnoreMouseEvents;
    vm.handleResultClick = handleResultClick;
    vm.ensureSelectedResultIsVisible = ensureSelectedResultIsVisible;

    //////////

    init();

    function init() {
      // Watch the model changes to trigger the search
      $scope.$watch('MsSearchBar.query', (current, old) => {
        if (angular.isUndefined(current)) {
          return;
        }

        if (angular.equals(current, old)) {
          return;
        }

        if (vm.collapsed) {
          return;
        }

        // Evaluate the onSearch function to access the
        // function itself
        let onSearchEvaluated = $scope.$parent.$eval(vm.onSearch, {
            query: current
          }),
          isArray = angular.isArray(onSearchEvaluated),
          isPromise = (onSearchEvaluated && !!onSearchEvaluated.then);

        if (isArray) {
          // Populate the results
          vm.populateResults(onSearchEvaluated);
        }

        if (isPromise) {
          vm.resultsLoading = true;
          onSearchEvaluated
            .then((response) => { vm.populateResults(response); }, () => { vm.populateResults([]); })
            .finally(() => {
              vm.resultsLoading = false;
            });
        }
      });
    }

    /**
     * Populate the results
     *
     * @param results
     */
    function populateResults(results) {
      // Before doing anything,
      // make sure the search bar is expanded
      if (vm.collapsed) {
        return;
      }

      let isArray = angular.isArray(results),
        isNull = results === null;

      // Only accept arrays and null values
      if (!isArray && !isNull) {
        return;
      }

      // Reset the selected result
      vm.selectedResultIndex = 0;

      // Populate the results
      vm.results = results;
    }

    /**
     * Expand
     */
    function expand() {
      // Set collapsed status
      vm.collapsed = false;

      // Call expand on scope
      $scope.expand();

      // Callback
      if (vm.onExpand && angular.isFunction(vm.onExpand)) {
        vm.onExpand();
      }
    }

    /**
     * Collapse
     */
    function collapse() {
      // Empty the query
      vm.query = '';

      // Empty results to hide the results view
      vm.populateResults(null);

      // Set collapsed status
      vm.collapsed = true;

      // Call collapse on scope
      $scope.collapse();

      // Callback
      if (vm.onCollapse && angular.isFunction(vm.onCollapse)) {
        vm.onCollapse();
      }
    }

    /**
     * Absorb the given event
     *
     * @param event
     */
    function absorbEvent(event) {
      event.preventDefault();
    }

    /**
     * Handle keydown
     *
     * @param event
     */
    function handleKeydown(event) {
      let keyCode = event.keyCode,
        keys = [27, 38, 40];

      // Prevent the default action if
      // one of the keys are pressed that
      // we are listening
      if (keys.indexOf(keyCode) > -1) {
        event.preventDefault();
      }

      switch (keyCode) {
        // Enter
        case 13:

          // Trigger result click
          vm.handleResultClick(vm.results[vm.selectedResultIndex]);

          break;

          // Escape
        case 27:

          // Collapse the search bar
          vm.collapse();

          break;

          // Up Arrow
        case 38:

          // Decrease the selected result index
          if (vm.selectedResultIndex - 1 >= 0) {
            // Decrease the selected index
            vm.selectedResultIndex--;

            // Make sure the selected result is in the view
            vm.ensureSelectedResultIsVisible();
          }

          break;

          // Down Arrow
        case 40:

          if (!vm.results) {
            return;
          }

          // Increase the selected result index
          if (vm.selectedResultIndex + 1 < vm.results.length) {
            // Increase the selected index
            vm.selectedResultIndex++;

            // Make sure the selected result is in the view
            vm.ensureSelectedResultIsVisible();
          }

          break;

        default:
          break;
      }
    }

    /**
     * Handle mouseenter
     *
     * @param index
     */
    function handleMouseenter(index) {
      if (vm.ignoreMouseEvents) {
        return;
      }

      // Update the selected result index
      // with the given index
      vm.selectedResultIndex = index;
    }

    /**
     * Set a variable for a limited time
     * to make other functions to ignore
     * the mouse events
     */
    function temporarilyIgnoreMouseEvents() {
      // Set the variable
      vm.ignoreMouseEvents = true;

      // Cancel the previous timeout
      $timeout.cancel(vm.mouseEventIgnoreTimeout);

      // Set the timeout
      vm.mouseEventIgnoreTimeout = $timeout(() => {
        vm.ignoreMouseEvents = false;
      }, 250);
    }

    /**
     * Handle the result click
     *
     * @param item
     */
    function handleResultClick(item) {
      if (vm.onResultClick) {
        vm.onResultClick({
          item
        });
      }

      // Collapse the search bar
      vm.collapse();
    }

    /**
     * Ensure the selected result will
     * always be visible on the results
     * area
     */
    function ensureSelectedResultIsVisible() {
      let resultsEl = $element.find('.ms-search-bar-results'),
        selectedItemEl = angular.element(resultsEl.find('.result')[vm.selectedResultIndex]);

      if (resultsEl && selectedItemEl) {
        let top = selectedItemEl.position()
          .top - 8,
          bottom = selectedItemEl.position()
          .top + selectedItemEl.outerHeight() + 8;

        // Start ignoring mouse events
        vm.temporarilyIgnoreMouseEvents();

        if (resultsEl.scrollTop() > top) {
          resultsEl.scrollTop(top);
        }

        if (bottom > (resultsEl.height() + resultsEl.scrollTop())) {
          resultsEl.scrollTop(bottom - resultsEl.height());
        }
      }
    }
  }

  /** @ngInject */
  function msSearchBarDirective() {
    return {
      restrict: 'E',
      scope: {},
      require: 'msSearchBar',
      controller: 'MsSearchBarController as MsSearchBar',
      bindToController: {
        debounce: '=?',
        onSearch: '@',
        onResultClick: '&?',
        onExpand: '&?',
        onCollapse: '&?'
      },
      templateUrl: 'app/core/directives/ms-search-bar/ms-search-bar.html',
      compile(tElement) {
        // Add class
        tElement.addClass('ms-search-bar');

        return function postLink(scope, iElement) {
          // Data
          let inputEl,
            bodyEl = angular.element('body');

          // Methods
          scope.collapse = collapse;
          scope.expand = expand;

          //////////

          // Initialize
          init();

          /**
           * Initialize
           */
          function init() {
            // Grab the input element
            inputEl = iElement.find('#ms-search-bar-input');
          }

          /**
           * Expand action
           */
          function expand() {
            // Add expanded class
            iElement.addClass('expanded');

            // Add helper class to the body
            bodyEl.addClass('ms-search-bar-expanded');

            // Focus on the input
            inputEl.focus();
          }

          /**
           * Collapse action
           */
          function collapse() {
            // Remove expanded class
            iElement.removeClass('expanded');

            // Remove helper class from the body
            bodyEl.removeClass('ms-search-bar-expanded');
          }
        };
      }
    };
  }
})();
