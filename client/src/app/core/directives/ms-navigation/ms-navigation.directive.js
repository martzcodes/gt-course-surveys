(function () {
  'use strict';

  angular
    .module('app.core')
    .provider('msNavigationService', msNavigationServiceProvider)
    .controller('MsNavigationController', MsNavigationController)
    // Vertical
    .directive('msNavigation', msNavigationDirective)
    .controller('MsNavigationNodeController', MsNavigationNodeController)
    .directive('msNavigationNode', msNavigationNodeDirective)
    .directive('msNavigationItem', msNavigationItemDirective);

  /** @ngInject */
  function msNavigationServiceProvider() {
    // Navigation array
    var navigation = [];

    var service = this;

    // Methods
    service.saveItem = saveItem;
    service.deleteItem = deleteItem;
    service.sortByWeight = sortByWeight;

    //////////

    /**
     * Create or update the navigation item
     *
     * @param path
     * @param item
     */
    function saveItem(path, item) {
      if (!angular.isString(path)) {
        return;
      }

      var parts = path.split('.');

      // Generate the object id from the parts
      var id = parts[parts.length - 1];

      // Get the parent item from the parts
      var parent = _findOrCreateParent(parts);

      // Decide if we are going to update or create
      var updateItem = false;

      for (var i = 0; i < parent.length; i++) {
        if (parent[i]._id === id) {
          updateItem = parent[i];

          break;
        }
      }

      // Update
      if (updateItem) {
        angular.extend(updateItem, item);

        // Add proper ui-sref
        updateItem.uisref = _getUiSref(updateItem);
      }
      // Create
      else {
        // Create an empty children array in the item
        item.children = [];

        // Add the default weight if not provided or if it's not a number
        if (angular.isUndefined(item.weight) || !angular.isNumber(item.weight)) {
          item.weight = 1;
        }

        // Add the item id
        item._id = id;

        // Add the item path
        item._path = path;

        // Add proper ui-sref
        item.uisref = _getUiSref(item);

        // Push the item into the array
        parent.push(item);
      }
    }

    /**
     * Delete navigation item
     *
     * @param path
     */
    function deleteItem(path) {
      if (!angular.isString(path)) {
        return;
      }

      // Locate the item by using given path
      var item = navigation,
        parts = path.split('.');

      for (var p = 0; p < parts.length; p++) {
        var id = parts[p];

        for (var i = 0; i < item.length; i++) {
          if (item[i]._id === id) {
            // If we have a matching path,
            // we have found our object:
            // remove it.
            if (item[i]._path === path) {
              item.splice(i, 1);
              return true;
            }

            // Otherwise grab the children of
            // the current item and continue
            item = item[i].children;
            break;
          }
        }
      }

      return false;
    }

    /**
     * Sort the navigation items by their weights
     *
     * @param parent
     */
    function sortByWeight(parent) {
      // If parent not provided, sort the root items
      if (!parent) {
        parent = navigation;
        parent.sort(_byWeight);
      }

      // Sort the children
      for (var i = 0; i < parent.length; i++) {
        var children = parent[i].children;

        if (children.length > 1) {
          children.sort(_byWeight);
        }

        if (children.length > 0) {
          sortByWeight(children);
        }
      }
    }

    /* ----------------- */
    /* Private Functions */
    /* ----------------- */

    /**
     * Find or create parent
     *
     * @param parts
     * @return {Array|Boolean}
     * @private
     */
    function _findOrCreateParent(parts) {
      // Store the main navigation
      var parent = navigation;

      // If it's going to be a root item
      // return the navigation itself
      if (parts.length === 1) {
        return parent;
      }

      // Remove the last element from the parts as
      // we don't need that to figure out the parent
      parts.pop();

      // Find and return the parent
      for (var i = 0; i < parts.length; i++) {
        var _id = parts[i],
          createParent = true;

        for (var p = 0; p < parent.length; p++) {
          if (parent[p]._id === _id) {
            parent = parent[p].children;
            createParent = false;

            break;
          }
        }

        // If there is no parent found, create one, push
        // it into the current parent and assign it as a
        // new parent
        if (createParent) {
          var item = {
            _id: _id,
            _path: parts.join('.'),
            title: _id,
            weight: 1,
            children: []
          };

          parent.push(item);
          parent = item.children;
        }
      }

      return parent;
    }

    /**
     * Sort by weight
     *
     * @param x
     * @param y
     * @return {number}
     * @private
     */
    function _byWeight(x, y) {
      return x.weight - y.weight;
      // return parseInt(x.weight) - parseInt(y.weight);
    }

    /**
     * Setup the ui-sref using state & state parameters
     *
     * @param item
     * @return {string}
     * @private
     */
    function _getUiSref(item) {
      var uisref = '';

      if (angular.isDefined(item.state)) {
        uisref = item.state;

        if (angular.isDefined(item.stateParams) && angular.isObject(item.stateParams)) {
          uisref = uisref + '(' + angular.toJson(item.stateParams) + ')';
        }
      }

      return uisref;
    }

    /* ----------------- */
    /* Service           */
    /* ----------------- */

    this.$get = function () {
      var activeItem = null,
        navigationScope = null,
        folded = null,
        foldedOpen = null;

      var service = {
        saveItem: saveItem,
        deleteItem: deleteItem,
        sort: sortByWeight,
        clearNavigation: clearNavigation,
        setActiveItem: setActiveItem,
        getActiveItem: getActiveItem,
        getNavigation: getNavigation,
        getFlatNavigation: getFlatNavigation,
        setNavigationScope: setNavigationScope,
        setFolded: setFolded,
        getFolded: getFolded,
        setFoldedOpen: setFoldedOpen,
        getFoldedOpen: getFoldedOpen,
        toggleFolded: toggleFolded
      };

      return service;

      //////////

      /**
       * Clear the entire navigation
       */
      function clearNavigation() {
        // Clear the navigation array
        navigation = [];

        // Clear the vm.navigation from main controller
        if (navigationScope) {
          navigationScope.vm.navigation = navigation;
        }
      }

      /**
       * Set active item
       *
       * @param node
       * @param scope
       */
      function setActiveItem(node, scope) {
        activeItem = {
          node: node,
          scope: scope
        };
      }

      /**
       * Return active item
       */
      function getActiveItem() {
        return activeItem;
      }

      /**
       * Return navigation array
       *
       * @param {string} root
       * @return {?Array<*>}
       */
      function getNavigation(root) {
        if (root) {
          for (var i = 0; i < navigation.length; i++) {
            if (navigation[i]._id === root) {
              return [navigation[i]];
            }
          }

          return null;
        }

        return navigation;
      }

      /**
       * Return flat navigation array
       *
       * @param root
       * @return Array
       */
      function getFlatNavigation(root) {
        // Get the correct navigation array
        var navigation = getNavigation(root);

        // Flatten the navigation object
        return _flattenNavigation(navigation);
      }

      /**
       * Store navigation's scope for later use
       *
       * @param scope
       */
      function setNavigationScope(scope) {
        navigationScope = scope;
      }

      /**
       * Set folded status
       *
       * @param status
       */
      function setFolded(status) {
        folded = status;
      }

      /**
       * Return folded status
       *
       * @return {*}
       */
      function getFolded() {
        return folded;
      }

      /**
       * Set folded open status
       *
       * @param status
       */
      function setFoldedOpen(status) {
        foldedOpen = status;
      }

      /**
       * Return folded open status
       *
       * @return {*}
       */
      function getFoldedOpen() {
        return foldedOpen;
      }

      /**
       * Toggle fold on stored navigation's scope
       */
      function toggleFolded() {
        navigationScope.toggleFolded();
      }

      /**
       * Flatten the given navigation
       *
       * @param navigation
       * @private
       */
      function _flattenNavigation(navigation) {
        var flatNav = [];

        for (var x = 0; x < navigation.length; x++) {
          // Copy and clear the children of the
          // navigation that we want to push
          var navToPush = angular.copy(navigation[x]);
          navToPush.children = [];

          // Push the item
          flatNav.push(navToPush);

          // If there are child items in this navigation,
          // do some nested function magic
          if (navigation[x].children.length > 0) {
            flatNav = flatNav.concat(_flattenNavigation(navigation[x].children));
          }
        }

        return flatNav;
      }
    };
  }

  /** @ngInject */
  function MsNavigationController($scope, msNavigationService) {
    var vm = this;

    // Data
    if ($scope.root) {
      vm.navigation = msNavigationService.getNavigation($scope.root);
    } else {
      vm.navigation = msNavigationService.getNavigation();
    }

    //////////

    init();

    function init() {
      msNavigationService.sort();
    }
  }

  /** @ngInject */
  function msNavigationDirective($rootScope, $timeout, $mdSidenav, msNavigationService) {
    return {
      restrict: 'E',
      scope: {
        folded: '=',
        root: '@'
      },
      controller: 'MsNavigationController as vm',
      templateUrl: 'app/core/directives/ms-navigation/templates/vertical.html',
      transclude: true,
      compile: function (tElement) {
        tElement.addClass('ms-navigation');

        return function postLink(scope, iElement) {
          var bodyEl = angular.element('body'),
            foldExpanderEl = angular.element('<div id="ms-navigation-fold-expander"></div>'),
            foldCollapserEl = angular.element('<div id="ms-navigation-fold-collapser"></div>'),
            sidenav = $mdSidenav('navigation');

          // Store the navigation in the service for public access
          msNavigationService.setNavigationScope(scope);

          // Initialize
          init();

          /**
           * Initialize
           */
          function init() {
            // Set the folded status for the first time.
            // First, we have to check if we have a folded
            // status available in the service already. This
            // will prevent navigation to act weird if we already
            // set the fold status, remove the navigation and
            // then re-initialize it, which happens if we
            // change to a view without a navigation and then
            // come back with history.back() function.

            // If the service didn't initialize before, set
            // the folded status from scope, otherwise we
            // won't touch anything because the folded status
            // already set in the service...
            if (msNavigationService.getFolded() === null) {
              msNavigationService.setFolded(scope.folded);
            }

            if (msNavigationService.getFolded()) {
              // Collapse everything.
              // This must be inside a $timeout because by the
              // time we call this, the 'msNavigation::collapse'
              // event listener is not registered yet. $timeout
              // will ensure that it will be called after it is
              // registered.
              $timeout(function () {
                $rootScope.$broadcast('msNavigation::collapse');
              });

              // Add class to the body
              bodyEl.addClass('ms-navigation-folded');

              // Set fold expander
              setFoldExpander();
            }
          }

          // Sidenav locked open status watcher
          scope.$watch(function () {
            return sidenav.isLockedOpen();
          }, function (current, old) {
            if (angular.isUndefined(current) || angular.equals(current, old)) {
              return;
            }

            var folded = msNavigationService.getFolded();

            if (folded) {
              if (current) {
                // Collapse everything
                $rootScope.$broadcast('msNavigation::collapse');
              } else {
                // Expand the active one and its parents
                var activeItem = msNavigationService.getActiveItem();
                if (activeItem) {
                  activeItem.scope.$emit('msNavigation::stateMatched');
                }
              }
            }
          });

          // Folded status watcher
          scope.$watch('folded', function (current, old) {
            if (angular.isUndefined(current) || angular.equals(current, old)) {
              return;
            }

            setFolded(current);
          });

          /**
           * Set folded status
           *
           * @param folded
           */
          function setFolded(folded) {
            // Store folded status on the service for global access
            msNavigationService.setFolded(folded);

            if (folded) {
              // Collapse everything
              $rootScope.$broadcast('msNavigation::collapse');

              // Add class to the body
              bodyEl.addClass('ms-navigation-folded');

              // Set fold expander
              setFoldExpander();
            } else {
              // Expand the active one and its parents
              var activeItem = msNavigationService.getActiveItem();
              if (activeItem) {
                activeItem.scope.$emit('msNavigation::stateMatched');
              }

              // Remove body class
              bodyEl.removeClass('ms-navigation-folded ms-navigation-folded-open');

              // Remove fold collapser
              removeFoldCollapser();
            }
          }

          /**
           * Set fold expander
           */
          function setFoldExpander() {
            iElement.parent()
              .append(foldExpanderEl);

            // Let everything settle for a moment
            // before registering the event listener
            $timeout(function () {
              foldExpanderEl.on('mouseenter touchstart', onFoldExpanderHover);
            });
          }

          /**
           * Set fold collapser
           */
          function setFoldCollapser() {
            bodyEl.find('#main')
              .append(foldCollapserEl);
            foldCollapserEl.on('mouseenter touchstart', onFoldCollapserHover);
          }

          /**
           * Remove fold collapser
           */
          function removeFoldCollapser() {
            foldCollapserEl.remove();
          }

          /**
           * onHover event of foldExpander
           */
          function onFoldExpanderHover(event) {
            if (event) {
              event.preventDefault();
            }

            // Set folded open status
            msNavigationService.setFoldedOpen(true);

            // Expand the active one and its parents
            var activeItem = msNavigationService.getActiveItem();
            if (activeItem) {
              activeItem.scope.$emit('msNavigation::stateMatched');
            }

            // Add class to the body
            bodyEl.addClass('ms-navigation-folded-open');

            // Remove the fold opener
            foldExpanderEl.remove();

            // Set fold collapser
            setFoldCollapser();
          }

          /**
           * onHover event of foldCollapser
           */
          function onFoldCollapserHover(event) {
            if (event) {
              event.preventDefault();
            }

            // Set folded open status
            msNavigationService.setFoldedOpen(false);

            // Collapse everything
            $rootScope.$broadcast('msNavigation::collapse');

            // Remove body class
            bodyEl.removeClass('ms-navigation-folded-open');

            // Remove the fold collapser
            foldCollapserEl.remove();

            // Set fold expander
            setFoldExpander();
          }

          /**
           * Public access for toggling folded status externally
           */
          scope.toggleFolded = function () {
            var folded = msNavigationService.getFolded();

            setFolded(!folded);
          };

          /**
           * On $stateChangeStart
           */
          scope.$on('$stateChangeStart', function () {
            // Close the sidenav
            sidenav.close();
          });

          // Cleanup
          scope.$on('$destroy', function () {
            foldCollapserEl.off('mouseenter touchstart');
            foldExpanderEl.off('mouseenter touchstart');
          });
        };
      }
    };
  }

  /** @ngInject */
  function MsNavigationNodeController($scope, $element, $rootScope, $animate, $state, msNavigationService) {
    var vm = this;

    // Data
    vm.element = $element;
    vm.node = $scope.node;
    vm.hasChildren = undefined;
    vm.collapsed = undefined;
    vm.collapsable = undefined;
    vm.group = undefined;
    vm.animateHeightClass = 'animate-height';

    // Methods
    vm.toggleCollapsed = toggleCollapsed;
    vm.collapse = collapse;
    vm.expand = expand;
    vm.getClass = getClass;
    vm.isHidden = isHidden;

    //////////

    init();

    /**
     * Initialize
     */
    function init() {
      // Setup the initial values

      // Has children?
      vm.hasChildren = vm.node.children.length > 0;

      // Is group?
      vm.group = !!(angular.isDefined(vm.node.group) && vm.node.group === true);

      // Is collapsable?
      if (!vm.hasChildren || vm.group) {
        vm.collapsable = false;
      } else {
        vm.collapsable = !!(angular.isUndefined(vm.node.collapsable) || typeof vm.node.collapsable !== 'boolean' || vm.node.collapsable === true);
      }

      // Is collapsed?
      if (!vm.collapsable) {
        vm.collapsed = false;
      } else {
        vm.collapsed = !!(angular.isUndefined(vm.node.collapsed) || typeof vm.node.collapsed !== 'boolean' || vm.node.collapsed === true);
      }

      // Expand all parents if we have a matching state or
      // the current state is a child of the node's state
      if (vm.node.state === $state.current.name || $state.includes(vm.node.state)) {
        // If state params are defined, make sure they are
        // equal, otherwise do not set the active item
        if (angular.isDefined(vm.node.stateParams) && angular.isDefined($state.params) && !angular.equals(vm.node.stateParams, $state.params)) {
          return;
        }

        $scope.$emit('msNavigation::stateMatched');

        // Also store the current active menu item
        msNavigationService.setActiveItem(vm.node, $scope);
      }

      $scope.$on('msNavigation::stateMatched', function () {
        // Expand if the current scope is collapsable and is collapsed
        if (vm.collapsable && vm.collapsed) {
          $scope.$evalAsync(function () {
            vm.collapsed = false;
          });
        }
      });

      // Listen for collapse event
      $scope.$on('msNavigation::collapse', function (event, path) {
        if (vm.collapsed || !vm.collapsable) {
          return;
        }

        // If there is no path defined, collapse
        if (angular.isUndefined(path)) {
          vm.collapse();
        }
        // If there is a path defined, do not collapse
        // the items that are inside that path. This will
        // prevent parent items from collapsing
        else {
          var givenPathParts = path.split('.'),
            activePathParts = [];

          var activeItem = msNavigationService.getActiveItem();
          if (activeItem) {
            activePathParts = activeItem.node._path.split('.');
          }

          // Test for given path
          if (givenPathParts.indexOf(vm.node._id) > -1) {
            return;
          }

          // Test for active path
          if (activePathParts.indexOf(vm.node._id) > -1) {
            return;
          }

          vm.collapse();
        }
      });

      // Listen for $stateChangeSuccess event
      $scope.$on('$stateChangeSuccess', function () {
        if (vm.node.state === $state.current.name) {
          // If state params are defined, make sure they are
          // equal, otherwise do not set the active item
          if (angular.isDefined(vm.node.stateParams) && angular.isDefined($state.params) && !angular.equals(vm.node.stateParams, $state.params)) {
            return;
          }

          // Update active item on state change
          msNavigationService.setActiveItem(vm.node, $scope);

          // Collapse everything except the one we're using
          $rootScope.$broadcast('msNavigation::collapse', vm.node._path);
        }

        // Expand the parents if we the current
        // state is a child of the node's state
        if ($state.includes(vm.node.state)) {
          // If state params are defined, make sure they are
          // equal, otherwise do not set the active item
          if (angular.isDefined(vm.node.stateParams) && angular.isDefined($state.params) && !angular.equals(vm.node.stateParams, $state.params)) {
            return;
          }

          // Emit the stateMatched
          $scope.$emit('msNavigation::stateMatched');
        }
      });
    }

    /**
     * Toggle collapsed
     */
    function toggleCollapsed() {
      if (vm.collapsed) {
        vm.expand();
      } else {
        vm.collapse();
      }
    }

    /**
     * Collapse
     */
    function collapse() {
      // Grab the element that we are going to collapse
      var collapseEl = vm.element.children('ul');

      // Grab the height
      var height = collapseEl[0].offsetHeight;

      $scope.$evalAsync(function () {
        // Set collapsed status
        vm.collapsed = true;

        // Add collapsing class to the node
        vm.element.addClass('collapsing');

        // Animate the height
        $animate.animate(collapseEl, {
              'display': 'block',
              'height': height + 'px'
            },{
              'height': '0px'
            },
            vm.animateHeightClass
          )
          .then(
            function () {
              // Clear the inline styles after animation done
              collapseEl.css({
                'display': '',
                'height': ''
              });

              // Clear collapsing class from the node
              vm.element.removeClass('collapsing');
            }
          );

        // Broadcast the collapse event so child items can also be collapsed
        $scope.$broadcast('msNavigation::collapse');
      });
    }

    /**
     * Expand
     */
    function expand() {
      // Grab the element that we are going to expand
      var expandEl = vm.element.children('ul');

      // Move the element out of the dom flow and
      // make it block so we can get its height
      expandEl.css({
        'position': 'absolute',
        'visibility': 'hidden',
        'display': 'block',
        'height': 'auto'
      });

      // Grab the height
      var height = expandEl[0].offsetHeight;

      // Reset the style modifications
      expandEl.css({
        'position': '',
        'visibility': '',
        'display': '',
        'height': ''
      });

      $scope.$evalAsync(function () {
        // Set collapsed status
        vm.collapsed = false;

        // Add expanding class to the node
        vm.element.addClass('expanding');

        // Animate the height
        $animate.animate(expandEl, {
              'display': 'block',
              'height': '0px'
            },{
              'height': height + 'px'
            },
            vm.animateHeightClass
          )
          .then(
            function () {
              // Clear the inline styles after animation done
              expandEl.css({
                'height': ''
              });

              // Clear expanding class from the node
              vm.element.removeClass('expanding');
            }
          );

        // If item expanded, broadcast the collapse event from rootScope so that the other expanded items
        // can be collapsed. This is necessary for keeping only one parent expanded at any time
        $rootScope.$broadcast('msNavigation::collapse', vm.node._path);
      });
    }

    /**
     * Return the class
     *
     * @return {*}
     */
    function getClass() {
      return vm.node.class;
    }

    /**
     * Check if node should be hidden
     *
     * @return {boolean}
     */
    function isHidden() {
      if (angular.isDefined(vm.node.hidden) && angular.isFunction(vm.node.hidden)) {
        return vm.node.hidden();
      }

      return false;
    }
  }

  /** @ngInject */
  function msNavigationNodeDirective() {
    return {
      restrict: 'A',
      bindToController: {
        node: '=msNavigationNode'
      },
      controller: 'MsNavigationNodeController as vm',
      compile: function (tElement) {
        tElement.addClass('ms-navigation-node');

        return function postLink(scope, iElement, iAttrs, MsNavigationNodeCtrl) {
          // Add custom classes
          iElement.addClass(MsNavigationNodeCtrl.getClass());

          // Add group class if it's a group
          if (MsNavigationNodeCtrl.group) {
            iElement.addClass('group');
          }
        };
      }
    };
  }

  /** @ngInject */
  function msNavigationItemDirective() {
    return {
      restrict: 'A',
      require: '^msNavigationNode',
      compile: function (tElement) {
        tElement.addClass('ms-navigation-item');

        return function postLink(scope, iElement, iAttrs, MsNavigationNodeCtrl) {
          // If the item is collapsable...
          if (MsNavigationNodeCtrl.collapsable) {
            iElement.on('click', MsNavigationNodeCtrl.toggleCollapsed);
          }

          // Cleanup
          scope.$on('$destroy', function () {
            iElement.off('click');
          });
        };
      }
    };
  }
})();
