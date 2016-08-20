(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('msNavFoldService', msNavFoldService)
    .directive('msNavIsFolded', msNavIsFoldedDirective)
    .controller('MsNavController', MsNavController)
    .directive('msNav', msNavDirective)
    .directive('msNavTitle', msNavTitleDirective)
    .directive('msNavButton', msNavButtonDirective)
    .directive('msNavToggle', msNavToggleDirective);

  /** @ngInject */
  function msNavFoldService() {
    var foldable = {};

    var service = {
      setFoldable: setFoldable,
      isNavFoldedOpen: isNavFoldedOpen,
      toggleFold: toggleFold,
      openFolded: openFolded,
      closeFolded: closeFolded
    };

    return service;

    //////////

    /**
     * Set the foldable
     *
     * @param scope
     * @param element
     */
    function setFoldable(scope, element) {
      foldable = {
        'scope': scope,
        'element': element
      };
    }

    /**
     * Is folded open
     */
    function isNavFoldedOpen() {
      return foldable.scope.isNavFoldedOpen();
    }

    /**
     * Toggle fold
     */
    function toggleFold() {
      foldable.scope.toggleFold();
    }

    /**
     * Open folded navigation
     */
    function openFolded() {
      foldable.scope.openFolded();
    }

    /**
     * Close folded navigation
     */
    function closeFolded() {
      foldable.scope.closeFolded();
    }
  }

  /** @ngInject */
  function msNavIsFoldedDirective($rootScope, msNavFoldService) {
    return {
      restrict: 'A',
      link: function (scope, iElement, iAttrs) {
        var isFolded = (iAttrs.msNavIsFolded === 'true'),
            isFoldedOpen = false,
            body = angular.element('body'),
            openOverlay = angular.element('<div id="ms-nav-fold-open-overlay"></div>'),
            closeOverlay = angular.element('<div id="ms-nav-fold-close-overlay"></div>'),
            sidenavEl = iElement.parent();

        // Initialize the service
        msNavFoldService.setFoldable(scope, iElement, isFolded);

        // Set the fold status for the first time
        if (isFolded) {
          fold();
        } else {
          unfold();
        }

        /**
         * Is nav folded open
         */
        function isNavFoldedOpen() {
          return isFoldedOpen;
        }

        /**
         * Toggle fold
         */
        function toggleFold() {
          isFolded = !isFolded;

          if (isFolded) {
            fold();
          } else {
            unfold();
          }
        }

        /**
         * Fold the navigation
         */
        function fold() {
          // Add classes
          body.addClass('ms-nav-folded');

          // Collapse everything and scroll to the top
          $rootScope.$broadcast('msNav::forceCollapse');
          iElement.scrollTop(0);

          // Append the openOverlay to the element
          sidenavEl.append(openOverlay);

          // Event listeners
          openOverlay.on('mouseenter touchstart', function (event) {
            openFolded(event);
            isFoldedOpen = true;
          });
        }

        /**
         * Open folded navigation
         */
        function openFolded(event) {
          if (angular.isDefined(event)) {
            event.preventDefault();
          }

          body.addClass('ms-nav-folded-open');

          // Update the location
          $rootScope.$broadcast('msNav::expandMatchingToggles');

          // Remove open overlay
          sidenavEl.find(openOverlay)
            .remove();

          // Append close overlay and bind its events
          sidenavEl.parent()
            .append(closeOverlay);
          closeOverlay.on('mouseenter touchstart', function (event) {
            closeFolded(event);
            isFoldedOpen = false;
          });
        }

        /**
         * Close folded navigation
         */
        function closeFolded(event) {
          if (angular.isDefined(event)) {
            event.preventDefault();
          }

          // Collapse everything and scroll to the top
          $rootScope.$broadcast('msNav::forceCollapse');
          iElement.scrollTop(0);

          body.removeClass('ms-nav-folded-open');

          // Remove close overlay
          sidenavEl.parent()
            .find(closeOverlay)
            .remove();

          // Append open overlay and bind its events
          sidenavEl.append(openOverlay);
          openOverlay.on('mouseenter touchstart', function (event) {
            openFolded(event);
            isFoldedOpen = true;
          });
        }

        /**
         * Unfold the navigation
         */
        function unfold() {
          body.removeClass('ms-nav-folded ms-nav-folded-open');

          // Update the location
          $rootScope.$broadcast('msNav::expandMatchingToggles');

          iElement.off('mouseenter mouseleave');
        }

        // Expose functions to the scope
        scope.toggleFold = toggleFold;
        scope.openFolded = openFolded;
        scope.closeFolded = closeFolded;
        scope.isNavFoldedOpen = isNavFoldedOpen;

        // Cleanup
        scope.$on('$destroy', function () {
          openOverlay.off('mouseenter touchstart');
          closeOverlay.off('mouseenter touchstart');
          iElement.off('mouseenter mouseleave');
        });
      }
    };
  }

  /** @ngInject */
  function MsNavController() {
    var vm = this,
      disabled = false,
      toggleItems = [],
      lockedItems = [];

    // Data

    // Methods
    vm.isDisabled = isDisabled;
    vm.enable = enable;
    vm.disable = disable;
    vm.setToggleItem = setToggleItem;
    vm.getLockedItems = getLockedItems;
    vm.setLockedItem = setLockedItem;
    vm.clearLockedItems = clearLockedItems;

    //////////

    /**
     * Is navigation disabled
     *
     * @return {boolean}
     */
    function isDisabled() {
      return disabled;
    }

    /**
     * Disable the navigation
     */
    function disable() {
      disabled = true;
    }

    /**
     * Enable the navigation
     */
    function enable() {
      disabled = false;
    }

    /**
     * Set toggle item
     *
     * @param element
     * @param scope
     */
    function setToggleItem(element, scope) {
      toggleItems.push({
        'element': element,
        'scope': scope
      });
    }

    /**
     * Get locked items
     *
     * @return {Array}
     */
    function getLockedItems() {
      return lockedItems;
    }

    /**
     * Set locked item
     *
     * @param element
     * @param scope
     */
    function setLockedItem(element, scope) {
      lockedItems.push({
        'element': element,
        'scope': scope
      });
    }

    /**
     * Clear locked items list
     */
    function clearLockedItems() {
      lockedItems = [];
    }
  }

  /** @ngInject */
  function msNavDirective($rootScope, $mdComponentRegistry, msNavFoldService) {
    return {
      restrict: 'E',
      scope: {},
      controller: 'MsNavController',
      compile: function (tElement) {
        tElement.addClass('ms-nav');

        return function postLink(scope) {
          // Update toggle status according to the ui-router current state
          $rootScope.$broadcast('msNav::expandMatchingToggles');

          // Update toggles on state changes
          var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function () {
            $rootScope.$broadcast('msNav::expandMatchingToggles');

            // Close navigation sidenav on stateChangeSuccess
            $mdComponentRegistry.when('navigation')
              .then(function (navigation) {
                navigation.close();

                if (msNavFoldService.isNavFoldedOpen()) {
                  msNavFoldService.closeFolded();
                }
              });
          });

          // Cleanup
          scope.$on('$destroy', function () {
            stateChangeSuccessEvent();
          });
        };
      }
    };
  }

  /** @ngInject */
  function msNavTitleDirective() {
    return {
      restrict: 'A',
      compile: function (tElement) {
        tElement.addClass('ms-nav-title');

        return function postLink() {

        };
      }
    };
  }

  /** @ngInject */
  function msNavButtonDirective() {
    return {
      restrict: 'AE',
      compile: function (tElement) {
        tElement.addClass('ms-nav-button');

        return function postLink() {

        };
      }
    };
  }

  /** @ngInject */
  function msNavToggleDirective($rootScope, $q, $animate, $state) {
    return {
      restrict: 'A',
      require: '^msNav',
      scope: true,
      compile: function (tElement, tAttrs) {
        tElement.addClass('ms-nav-toggle');

        // Add collapsed attr
        if (angular.isUndefined(tAttrs.collapsed)) {
          tAttrs.collapsed = true;
        }

        tElement.attr('collapsed', tAttrs.collapsed);

        return function postLink(scope, iElement, iAttrs, MsNavCtrl) {
          var classes = {
            expanded: 'expanded',
            expandAnimation: 'expand-animation',
            collapseAnimation: 'collapse-animation'
          };

          // Store all related states
          var links = iElement.find('a');
          var states = [];
          var regExp = /\(.*\)/g;

          angular.forEach(links, function (link) {
            var state = angular.element(link)
              .attr('ui-sref');

            if (angular.isUndefined(state)) {
              return;
            }

            // Remove any parameter definition from the state name before storing it
            state = state.replace(regExp, '');

            states.push(state);
          });

          // Store toggle-able element and its scope in the main nav controller
          MsNavCtrl.setToggleItem(iElement, scope);

          // Click handler
          iElement.children('.ms-nav-button')
            .on('click', toggle);

          // Toggle function
          function toggle() {
            // If navigation is disabled, do nothing...
            if (MsNavCtrl.isDisabled()) {
              return;
            }

            // Disable the entire navigation to prevent spamming
            MsNavCtrl.disable();

            if (isCollapsed()) {
              // Clear the locked items list
              MsNavCtrl.clearLockedItems();

              // Emit pushToLockedList event
              scope.$emit('msNav::pushToLockedList');

              // Collapse everything but locked items
              $rootScope.$broadcast('msNav::collapse');

              // Expand and then...
              expand()
                .then(function () {
                  // Enable the entire navigation after animations completed
                  MsNavCtrl.enable();
                });
            } else {
              // Collapse with all children
              scope.$broadcast('msNav::forceCollapse');
            }
          }

          // Cleanup
          scope.$on('$destroy', function () {
            iElement.children('.ms-nav-button')
              .off('click');
          });

          /*---------------------*/
          /* Scope Events        */
          /*---------------------*/

          /**
           * Collapse everything but locked items
           */
          scope.$on('msNav::collapse', function () {
            // Only collapse toggles that are not locked
            var lockedItems = MsNavCtrl.getLockedItems();
            var locked = false;

            angular.forEach(lockedItems, function (lockedItem) {
              if (angular.equals(lockedItem.scope, scope)) {
                locked = true;
              }
            });

            if (locked) {
              return;
            }

            // Collapse and then...
            collapse()
              .then(function () {
                // Enable the entire navigation after animations completed
                MsNavCtrl.enable();
              });
          });

          /**
           * Collapse everything
           */
          scope.$on('msNav::forceCollapse', function () {
            // Collapse and then...
            collapse()
              .then(function () {
                // Enable the entire navigation after animations completed
                MsNavCtrl.enable();
              });
          });

          /**
           * Expand toggles that match with the current states
           */
          scope.$on('msNav::expandMatchingToggles', function () {
            var currentState = $state.current.name;
            var shouldExpand = false;

            angular.forEach(states, function (state) {
              if (currentState === state) {
                shouldExpand = true;
              }
            });

            if (shouldExpand) {
              expand();
            } else {
              collapse();
            }
          });

          /**
           * Add toggle to the locked list
           */
          scope.$on('msNav::pushToLockedList', function () {
            // Set expanded item on main nav controller
            MsNavCtrl.setLockedItem(iElement, scope);
          });

          /*---------------------*/
          /* Internal functions  */
          /*---------------------*/

          /**
           * Is element collapsed
           *
           * @return {bool}
           */
          function isCollapsed() {
            return iElement.attr('collapsed') === 'true';
          }

          /**
           * Is element expanded
           *
           * @return {bool}
           */
          function isExpanded() {
            return !isCollapsed();
          }

          /**
           * Expand the toggle
           *
           * @return $promise
           */
          function expand() {
            // Create a new deferred object
            var deferred = $q.defer();

            // If the menu item is already expanded, do nothing..
            if (isExpanded()) {
              // Reject the deferred object
              deferred.reject({
                'error': true
              });

              // Return the promise
              return deferred.promise;
            }

            // Set element attr
            iElement.attr('collapsed', false);

            // Grab the element to expand
            var elementToExpand = angular.element(iElement.find('ms-nav-toggle-items')[0]);

            // Move the element out of the dom flow and
            // make it block so we can get its height
            elementToExpand.css({
              'position': 'absolute',
              'visibility': 'hidden',
              'display': 'block',
              'height': 'auto'
            });

            // Grab the height
            var height = elementToExpand[0].offsetHeight;

            // Reset the style modifications
            elementToExpand.css({
              'position': '',
              'visibility': '',
              'display': '',
              'height': ''
            });

            // Animate the height
            scope.$evalAsync(function () {
              $animate.animate(elementToExpand, {
                    'display': 'block',
                    'height': '0px'
                  },{
                    'height': height + 'px'
                  },
                  classes.expandAnimation
                )
                .then(
                  function () {
                    // Add expanded class
                    elementToExpand.addClass(classes.expanded);

                    // Clear the inline styles after animation done
                    elementToExpand.css({
                      'height': ''
                    });

                    // Resolve the deferred object
                    deferred.resolve({
                      'success': true
                    });
                  }
                );
            });

            // Return the promise
            return deferred.promise;
          }

          /**
           * Collapse the toggle
           *
           * @return $promise
           */
          function collapse() {
            // Create a new deferred object
            var deferred = $q.defer();

            // If the menu item is already collapsed, do nothing..
            if (isCollapsed()) {
              // Reject the deferred object
              deferred.reject({
                'error': true
              });

              // Return the promise
              return deferred.promise;
            }

            // Set element attr
            iElement.attr('collapsed', true);

            // Grab the element to collapse
            var elementToCollapse = angular.element(iElement.find('ms-nav-toggle-items')[0]);

            // Grab the height
            var height = elementToCollapse[0].offsetHeight;

            // Animate the height
            scope.$evalAsync(function () {
              $animate.animate(elementToCollapse, {
                    'height': height + 'px'
                  },{
                    'height': '0px'
                  },
                  classes.collapseAnimation
                )
                .then(
                  function () {
                    // Remove expanded class
                    elementToCollapse.removeClass(classes.expanded);

                    // Clear the inline styles after animation done
                    elementToCollapse.css({
                      'display': '',
                      'height': ''
                    });

                    // Resolve the deferred object
                    deferred.resolve({
                      'success': true
                    });
                  }
                );
            });

            // Return the promise
            return deferred.promise;
          }
        };
      }
    };
  }
})();
