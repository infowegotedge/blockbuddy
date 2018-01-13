import { browser, by, element } from 'protractor';

export class ForgetPassword {

  private clearAndSendKeys(value) {
    element(by.css('#email')).clear();
    element(by.css('#email')).sendKeys(value);
  }

  getForgetPassword() {
    let aTag = element(by.css('#login .form-group > .checkbox a'));
    browser.actions().mouseMove(aTag).click().perform();
    browser.wait(() => element(by.css('#email')).isPresent(), 2000, 'long wait')
    return element(by.css('#email')).isPresent();
  }

  getForgetPasswordWithoutValue() {
    let button = element(by.css('#login .form-group button[type="submit"]'));
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('#login .form-group > .help-block')).isPresent(), 2000, 'long wait')
    return element(by.css('#login .form-group > .help-block')).getText();
  }

  getForgetPasswordWithValueError(value) {
    let button = element(by.css('#login .form-group button[type="submit"]'));
    this.clearAndSendKeys(value);
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('#login .form-group > .help-block')).isPresent(), 2000, 'long wait')
    return element(by.css('#login .form-group > .help-block')).getText();
  }

  getForgetPasswordWithValueEmailIsWrong(value) {
    let button = element(by.css('#login .form-group button[type="submit"]'));
    this.clearAndSendKeys(value);
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('#login > .alert.alert-danger > h4')).isPresent(), 2000, 'long wait')
    return element(by.css('#login .alert.alert-danger > h4')).getText();
  }

  getForgetPasswordWithValue(value) {
    let button = element(by.css('#login .form-group button[type="submit"]'));
    this.clearAndSendKeys(value);
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('#login > .alert.alert-success > h4')).isPresent(), 2000, 'long wait')
    return element(by.css('#login .alert.alert-success > h4')).getText();
  }

}