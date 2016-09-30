'use strict';

describe('service: User', function () {
  var User;
  var msUtils;
  var firebase;
  var moment;
  var _;

  var $timeout;

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector) {
    User = $injector.get('User');
    msUtils = $injector.get('msUtils');
    firebase = $injector.get('firebase');
    moment = $injector.get('moment');
    _ = $injector.get('_');

    $timeout = $injector.get('$timeout');
  }));

  describe('get', function () {
    var userId;
    var userData;
    var userSnapshot;
    var userRecord;

    beforeEach(function () {
      userId = 'id';
      userData = { name: 'name', email: 'email' };
      userSnapshot = firebase.snapshot(_.fromPairs([[userId, userData]]));
      userRecord = msUtils.oneRecordFromSnapshot(userSnapshot);

      User.clear();

      firebase.clear();
      firebase.database().ref('users').child(userId).set(userData);

      spyOn(firebase, 'database').and.callThrough();
    });

    afterEach(function () {
      firebase.database.calls.reset();
    });

    it('returns null if an id is not provided', function (done) {
      User.get(null).then(function (user) {
        expect(user).toBeNull();
        expect(firebase.database).not.toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });

    it('returns null on firebase error', function (done) {
      User.get('ERROR').then(function (user) {
        expect(user).toBeNull();
        expect(firebase.database).toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });

    it('loads from database on cache miss', function (done) {
      User.get(userId).then(function (user) {
        expect(user).toEqual(userRecord);
        expect(firebase.database).toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });

    it('loads from cache on cache hit', function (done) {
      User.get(userId).then(function () {
        firebase.database.calls.reset();

        User.get(userId).then(function (user) {
          expect(user).toEqual(userRecord);
          expect(firebase.database).not.toHaveBeenCalled();
          done();
        });
      });

      $timeout.flush();
    });
  });

  describe('set', function () {
    var now;
    var userId;
    var userData;
    var userSnapshot;
    var userRecord;

    beforeEach(function () {
      now = moment.utc().format();
      userId = 'id';
      userData = { name: 'name', email: 'email' };
      userSnapshot = firebase.snapshot(_.fromPairs([[userId, userData]]));
      userRecord = msUtils.oneRecordFromSnapshot(userSnapshot);

      firebase.clear();

      spyOn(firebase, 'database').and.callThrough();
      spyOn(moment, 'utc').and.returnValue({ format: _.constant(now) });
    });

    afterEach(function () {
      firebase.database.calls.reset();
    });

    it('creates the user', function (done) {
      User.set(userId, userData).then(function (user) {
        expect(user).toEqual(jasmine.objectContaining(userRecord));
        expect(user.created).toEqual(now);
        expect(user.anonymous).toEqual(false);
        expect(firebase.database).toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });

    it('puts the user in cache', function (done) {
      User.set(userId, userData).then(function () {
        firebase.database.calls.reset();

        User.get(userId).then(function (user) {
          expect(user).toEqual(jasmine.objectContaining(userRecord));
          expect(user.created).toEqual(now);
          expect(firebase.database).not.toHaveBeenCalled();
          done();
        });
      });

      $timeout.flush();
    });
  });

  describe('update', function () {
    var now;
    var userId;
    var userData;
    var userUpdates;
    var userSnapshot;
    var userSnapshotUpdated;
    var userRecord;
    var userRecordUpdated;

    beforeEach(function () {
      now = moment.utc().format();
      userId = 'id';
      userData = { name: 'name', email: 'email' };
      userUpdates = { name: 'new name', email: 'email', profileImageUrl: 'http://domain.com' };
      userSnapshot = firebase.snapshot(_.fromPairs([[userId, userData]]));
      userSnapshotUpdated = firebase.snapshot(_.fromPairs([[userId, userUpdates]]));
      userRecord = msUtils.oneRecordFromSnapshot(userSnapshot);
      userRecordUpdated = msUtils.oneRecordFromSnapshot(userSnapshotUpdated);
      userRecordUpdated.profileImageUrl = 'https://domain.com';

      firebase.clear();

      spyOn(firebase, 'database').and.callThrough();
      spyOn(moment, 'utc').and.returnValue({ format: _.constant(now) });
    });

    afterEach(function () {
      firebase.database.calls.reset();
    });

    it('updates the user', function (done) {
      User.update(userRecord, userUpdates).then(function (user) {
        expect(user).toEqual(jasmine.objectContaining(userRecordUpdated));
        expect(user.updated).toEqual(now);
        expect(firebase.database).toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });

    it('puts the updated user in cache', function (done) {
      User.set(userId, userRecord).then(function () {
        User.update(userRecord, userUpdates).then(function () {
          firebase.database.calls.reset();

          User.get(userId).then(function (user) {
            expect(user).toEqual(jasmine.objectContaining(userRecordUpdated));
            expect(user.updated).toEqual(now);
            expect(firebase.database).not.toHaveBeenCalled();
            done();
          });
        });
      });

      $timeout.flush();
    });
  });
});
