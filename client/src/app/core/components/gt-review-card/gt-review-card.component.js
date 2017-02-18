(function () {
  'use strict';

  angular
    .module('app.core')
    .component('gtReviewCard', {
      templateUrl: 'app/core/components/gt-review-card/gt-review-card.html',
      controller: ReviewCardController,
      controllerAs: 'vm',
      bindings: {
        review: '<',
        showCourseTitle: '<',
        readOnly: '<',
        onEdit: '&',
        onRemove: '&'
      }
    });

  /** @ngInject */
  function ReviewCardController($filter, $location, Auth, Util) {
    const vm = this;
    const amDateFormat = $filter('amDateFormat');

    // Data

    vm.user = null;

    // Methods

    vm.createdTimeOf = createdTimeOf;
    vm.deepLinkOf = deepLinkOf;
    vm.onDeepLinkCopied = onDeepLinkCopied;
    vm.showButtons = showButtons;
    vm.edit = edit;
    vm.remove = remove;

    //////////

    init();

    async function init() {
      vm.user = await Auth.waitForUser();
    }

    function createdTimeOf(review) {
      if (_.includes([review.created, review.updated], '2015-11-05T06:00:00+00:00')) {
        return 'Imported';
      }
      return amDateFormat(review.created, 'M/D/YY, h:mm a');
    }

    function deepLinkOf(review) {
      return `${$location.absUrl()}?rid=${review._id}`;
    }

    function onDeepLinkCopied(/* $event */) {
      Util.toast('Copied link to clipboard.');
    }

    function showButtons() {
      return vm.user && vm.user._id === vm.review.author;
    }

    function edit($event, review) {
      vm.onEdit({ event: $event, review });
    }

    function remove($event, review) {
      vm.onRemove({ event: $event, review });
    }
  }
})();
