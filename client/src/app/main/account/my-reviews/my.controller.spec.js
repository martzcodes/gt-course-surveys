'use strict';

describe('controller: ReviewsMyController', function () {
  var vm;
  var reviews = [{}, {}, {}];

  beforeEach(module('app'));

  beforeEach(inject(function ($controller) {
    vm = $controller('ReviewsMyController', {
      reviews: reviews
    });
  }));

  it('caches reviews', function () {
    expect(vm.reviews).toEqual(reviews);
  });
});
