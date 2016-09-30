'use strict';

describe('service: msUtils', function () {
  var msUtils;
  var bowser;
  var firebase;
  var _;

  var $q;
  var $mdToast;
  var $mdDialog;
  var $timeout;

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector) {
    msUtils = $injector.get('msUtils');
    bowser = $injector.get('bowser');
    firebase = $injector.get('firebase');
    _ = $injector.get('_');

    $q = $injector.get('$q');
    $mdToast = $injector.get('$mdToast');
    $mdDialog = $injector.get('$mdDialog');
    $timeout = $injector.get('$timeout');
  }));

  describe('isMobile', function () {
    it('does not detect non-phone/non-table as mobile', function () {
      bowser.mobile = false;
      bowser.tablet = false;
      expect(msUtils.isMobile()).toEqual(false);
    });

    it('detects phones as mobile', function () {
      bowser.mobile = true;
      bowser.tablet = false;
      expect(msUtils.isMobile()).toEqual(true);
    });

    it('detects tablets as mobile', function () {
      bowser.mobile = false;
      bowser.tablet = true;
      expect(msUtils.isMobile()).toEqual(true);
    });
  });

  describe('toast', function () {
    beforeEach(function () {
      spyOn($mdToast, 'hide').and.returnValue($q.resolve());
      spyOn($mdToast, 'showSimple').and.returnValue($q.resolve());
    });

    it('does not show a toast when there is no message in an object payload', function (done) {
      var payload = { message: null };

      msUtils.toast(payload).then(function () {
        expect($mdToast.hide).not.toHaveBeenCalled();
        expect($mdToast.showSimple).not.toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });

    it('does not show a toast when payload is empty', function (done) {
      var payload = '';

      msUtils.toast(payload).finally(function () {
        expect($mdToast.hide).not.toHaveBeenCalled();
        expect($mdToast.showSimple).not.toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });

    it('shows a toast with an object payload', function (done) {
      var payload = { message: 'message' };

      msUtils.toast(payload).finally(function () {
        expect($mdToast.hide).toHaveBeenCalled();
        expect($mdToast.showSimple).toHaveBeenCalledWith(payload.message);
        done();
      });

      $timeout.flush();
    });

    it('shows a toast with a string payload', function (done) {
      var payload = 'message';

      msUtils.toast(payload).finally(function () {
        expect($mdToast.hide).toHaveBeenCalled();
        expect($mdToast.showSimple).toHaveBeenCalledWith(payload);
        done();
      });

      $timeout.flush();
    });
  });

  describe('oneRecordFromSnapshot', function () {
    it('returns null if snapshot does not exist', function () {
      var snapshot = firebase.snapshot(null);
      var record = msUtils.oneRecordFromSnapshot(snapshot);

      expect(record).toBeNull();
    });

    it('returns a valid record if snapshot exists', function () {
      var snapshot = firebase.snapshot({ id: { foo: 'bar' }});
      var record = msUtils.oneRecordFromSnapshot(snapshot);

      expect(record).toEqual({ id: 'id', foo: 'bar' });
    });
  });

  describe('manyRecordsFromSnapshot', function () {
    it('returns empty array if snapshot does not exist', function () {
      var snapshot = firebase.snapshot(null);
      var records = msUtils.manyRecordsFromSnapshot(snapshot);

      expect(records.length).toEqual(0);
    });

    it('returns an array of records if snapshot exists', function () {
      var snapshot = firebase.snapshot({
        id1: { foo: 'bar' },
        id2: { boo: 'far' },
        id3: null
      });
      var records = msUtils.manyRecordsFromSnapshot(snapshot);

      expect(records.length).toEqual(2);
      expect(records).toContain({ id: 'id1', foo: 'bar' });
      expect(records).toContain({ id: 'id2', boo: 'far' });
    });
  });

  describe('confirm', function () {
    var confirm;

    beforeEach(function () {
      confirm = {
        title:       function () { return this; },
        textContent: function () { return this; },
        ok:          function () { return this; },
        cancel:      function () { return this; },
        targetEvent: function () { return this; }
      };

      spyOn($mdDialog, 'show').and.callThrough();
      spyOn($mdDialog, 'confirm').and.returnValue(confirm);

      spyOn(confirm, 'title').and.callThrough();
      spyOn(confirm, 'textContent').and.callThrough();
      spyOn(confirm, 'ok').and.callThrough();
      spyOn(confirm, 'cancel').and.callThrough();
      spyOn(confirm, 'targetEvent').and.callThrough();
    });

    it('respects custom title and text', function () {
      var $event = { foo: 'bar' };
      var title = 'foo';
      var text = 'bar';

      msUtils.confirm($event, title, text);

      expect($mdDialog.show).toHaveBeenCalled();
      expect($mdDialog.confirm).toHaveBeenCalled();

      expect(confirm.title).toHaveBeenCalledWith(title);
      expect(confirm.textContent).toHaveBeenCalledWith(text);
      expect(confirm.ok).toHaveBeenCalledWith('CORE.OK');
      expect(confirm.cancel).toHaveBeenCalledWith('CORE.CANCEL');
      expect(confirm.targetEvent).toHaveBeenCalledWith($event);
    });

    it('defaults the title and text when omitted', function () {
      var $event = { foo: 'bar' };

      msUtils.confirm($event);

      expect($mdDialog.show).toHaveBeenCalled();
      expect($mdDialog.confirm).toHaveBeenCalled();

      expect(confirm.title).toHaveBeenCalledWith('CORE.CONFIRM');
      expect(confirm.textContent).toHaveBeenCalledWith('CORE.SURE');
      expect(confirm.ok).toHaveBeenCalledWith('CORE.OK');
      expect(confirm.cancel).toHaveBeenCalledWith('CORE.CANCEL');
      expect(confirm.targetEvent).toHaveBeenCalledWith($event);
    });
  });

  describe('hashCode', function () {
    it('return 0 for non-strings', function () {
      var tests = [undefined, null, false, true, 1, -1, {}, []];

      _.forEach(tests, function (test) {
        var hash = msUtils.hashCode(test);
        expect(hash).toEqual(0);
      });
    });

    it('returns 0 for an empty string', function () {
      var hash = msUtils.hashCode('');
      expect(hash).toEqual(0);
    });

    it('returns the hash of a non-empty string', function () {
      var tests = ['a','aa','abc','abbccd'];

      _.forEach(tests, function (test) {
        var hash = msUtils.hashCode(test);
        expect(typeof hash).toBe('number');
        expect(hash).not.toEqual(0);
      });
    });
  });
});
