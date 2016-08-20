(function () {
  'use strict';

  angular
    .module('app.core')
    .component('gtReviewCardList', {
      templateUrl: 'app/core/components/gt-review-card-list/gt-review-card-list.html',
      controller: ReviewCardListController,
      controllerAs: 'vm',
      bindings: {
        reviews: '=',
        showCourseTitle: '<',
        readOnly: '<',
        onReady: '&'
      }
    });

  /** @ngInject */
  function ReviewCardListController($rootScope, $filter, $mdDialog, msUtils, Review, Course, Semester, eventCode, _) {
    var vm = this;
    var translate = $filter('translate');

    // Data

    // Methods

    vm.$postLink = vm.onReady;

    vm.edit = edit;
    vm.remove = remove;

    //////////

    function edit($event, review) {
      var editing = !!review;

      $mdDialog.show({
        controller: 'ReviewDialogController as vm',
        templateUrl: 'app/core/dialogs/gt-review/gt-review.html',
        parent: angular.element('body'),
        targetEvent: $event,
        clickOutsideToClose: true,
        locals: {
          review: review
        },
        resolve: {
          courses: Course.all,
          semesters: Semester.all
        }
      })
      .then(function (review) {
        return Review.update(review);
      })
      .then(function (review) {
        var index = _.findIndex(vm.reviews, ['id', review.id]);
        if (index >= 0) {
          _.assign(vm.reviews[index], review);

          msUtils.toast(translate('CORE.UPDATED'));
        }

        if (editing) {
          $rootScope.$broadcast(eventCode.REVIEW_UPDATED, review);
        } else {
          $rootScope.$broadcast(eventCode.REVIEW_CREATED, review);
        }
      })
      .catch(msUtils.toast);
    }

    function remove($event, review) {
      msUtils.confirm($event)
      .then(function () {
        return Review.remove(review);
      })
      .then(function () {
        _.remove(vm.reviews, ['id', review.id]);

        msUtils.toast(translate('CORE.REMOVED'));

        $rootScope.$broadcast(eventCode.REVIEW_REMOVED, review);
      })
      .catch(msUtils.toast);
    }
  }
})();
