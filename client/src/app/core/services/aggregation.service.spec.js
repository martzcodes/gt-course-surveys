'use strict';

describe('service: Aggregation', function () {
  var Aggregation;

  var firebase;
  var apiUrl;
  var _;

  var $timeout;
  var $httpBackend;

  var aggregations = [{
    id: '6300',
    average: {
      difficulty: 2.5,
      rating: 3.9,
      workload: 7.3
    },
    count: 91,
    hash: 1537990979
  },{
    id: '6505',
    average: {
      difficulty: 4.8,
      rating: 2.2,
      workload: 21.3
    },
    count: 72,
    hash: -1855987841
  }];

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector) {
    Aggregation = $injector.get('Aggregation');

    firebase = $injector.get('firebase');
    apiUrl = $injector.get('apiUrl');
    _ = $injector.get('_');

    $timeout = $injector.get('$timeout');
    $httpBackend = $injector.get('$httpBackend');
  }));

  describe('all', function () {
    beforeEach(function () {
      firebase.clear();
      firebase.database()
        .ref('aggregations')
        .set(_.chain(aggregations)
          .map(function (a) {
            return [a.id, _.omit(a, 'id')];
          })
          .fromPairs()
          .value());

      $timeout.flush();
    });

    it('gets all aggregations', function (done) {
      Aggregation.all().then(function (result) {
        expect(result).toEqual(aggregations);
        done();
      });

      $timeout.flush();
    });
  });

  describe('get', function () {
    var id;
    var getUrl;
    var aggregation;
    var aggregationRequestHandler;

    beforeEach(function () {
      id = '6505';
      getUrl = apiUrl + '/aggregation/' + id;
      aggregation = _.find(aggregations, ['id', id]);
      aggregationRequestHandler = $httpBackend.when('GET', getUrl).respond(aggregation);
    });

    it('gets an aggregation by course id', function (done) {
      $httpBackend.expectGET(getUrl);

      Aggregation.get(id).then(function (result) {
        expect(result).toEqual(aggregation);
        done();
      });

      $httpBackend.flush();
      $timeout.flush();
    });

    it('fails on server error', function (done) {
      var error = { message: 'ERROR' };
      aggregationRequestHandler.respond(500, error);

      Aggregation.get(id).catch(function (result) {
        expect(result).toEqual(error);
        done();
      });

      $httpBackend.flush();
      $timeout.flush();
    });
  });

  describe('none', function () {
    it('defines an empty aggregation', function () {
      var none = Aggregation.none();

      expect(none.count).toEqual(0);
      expect(none.average.difficulty).toEqual(0);
      expect(none.average.workload).toEqual(0);
      expect(none.average.rating).toEqual(0);
    });
  });
});
