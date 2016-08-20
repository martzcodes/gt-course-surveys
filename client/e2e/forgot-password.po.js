'use strict';

/**
 * Forgot password page object.
 *
 * @constructor
 */
function ForgotPasswordPage() {
  /**
   * Email input.
   *
   * @type {!Element}
   */
  this.email = element(by.model('vm.user.email'));

  /**
   * Send Reset Link button.
   *
   * @type {!Element}
   */
  this.sendResetLinkButton = element(by.css('.submit-button'));

  /**
   * Back to login link.
   *
   * @type {!Element}
   */
  this.backToLoginLink = element(by.css('.login > a.link'));
}

/**
 * Clears the email from the input box.
 *
 * @return {!ForgotPasswordPage}
 */
ForgotPasswordPage.prototype.clearEmail = function () {
  this.email.clear();

  return this;
};

/**
 * Sets the email in the input box.
 *
 * @return {!ForgotPasswordPage}
 */
ForgotPasswordPage.prototype.setEmail = function (email) {
  this.clearEmail();
  this.email.sendKeys(email);

  return this;
};

/**
 * Clicks the Send Reset Link button.
 *
 * @return {!ForgotPasswordPage}
 */
ForgotPasswordPage.prototype.sendResetLink = function () {
  this.sendResetLinkButton.click();

  return this;
};

/**
 * Clicks the Back to login link.
 *
 * @return {!ForgotPasswordPage}
 */
ForgotPasswordPage.prototype.backToLogin = function () {
  this.backToLoginLink.click();

  return this;
};

module.exports = new ForgotPasswordPage();
