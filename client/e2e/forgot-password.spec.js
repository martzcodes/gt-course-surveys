'use strict';

var util = require('./util');

describe('/pages/auth/forgot-password', function () {
  var user = {
    email: 'test.user.forgot.password@nowhere.null',
    password: 'testing'
  };

  var page;

  describe('without email in url', function () {
    beforeEach(function () {
      browser.get('/pages/auth/forgot-password');
      browser.wait(function () {
        return browser.isElementPresent(by.css('.pages-auth-forgot-password'));
      });

      page = require('./forgot-password.po');
    });

    it('should disable send reset link button when there is no email', function () {
      expect(page.sendResetLinkButton.getAttribute('disabled')).toBe('true');
    });

    it('should enable send reset link button when there is an email', function () {
      page.setEmail(user.email);

      expect(page.sendResetLinkButton.getAttribute('disabled')).toBe(null);
    });

    it('should navigate to login page when back to login link is clicked', function () {
      page.backToLogin();

      expect(browser.getCurrentUrl()).toContain('/pages/auth/login');
    });

    it('should show a confirmation toast when the send reset link button is clicked', function () {
      page.setEmail(user.email);
      page.sendResetLink();

      util.expectToast('An email containing the password reset link has been sent.');
    });
  });

  describe('with email in url', function () {
    beforeEach(function () {
      browser.get('/pages/auth/forgot-password?e=' + user.email);
      browser.wait(function () {
        return browser.isElementPresent(by.css('.pages-auth-forgot-password'));
      });

      page = require('./forgot-password.po');
    });

    it('should populate email from url', function () {
      expect(page.email.getAttribute('value')).toEqual(user.email);
    });
  });
});
