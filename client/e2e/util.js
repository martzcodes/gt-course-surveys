'use strict';

/**
 * Waits for the browser URL to contain a certain string. Times out after 10s.
 *
 * @param {string} expectedUrl
 */
function expectUrl(expectedUrl) {
  browser.wait(function () {
    return browser.getCurrentUrl().then(function (url) {
      return url.indexOf(expectedUrl) !== -1;
    });
  });

  expect(browser.getCurrentUrl()).toContain(expectedUrl);
}

/**
 * Waits for a toast containing a message to appear. Times out after 10s.
 *
 * @param {string} expectedMessage
 */
function expectToast(expectedMessage) {
  var toastSelector = '.md-toast-content > span';
  var toast = by.css(toastSelector);

  browser.wait(function () {
    return browser.isElementPresent(toast = by.css(toastSelector));
  });

  expect(browser.element(toast).getText()).toContain(expectedMessage);
}

module.exports.expectUrl = expectUrl;
module.exports.expectToast = expectToast;
