import { element, by, browser } from 'protractor';

export class ProfilePages {

  private clearText() {
    element(by.css('#profile #username')).clear();
    element(by.css('#profile #first-name')).clear();
    element(by.css('#profile #last-name')).clear();
    element(by.css('#profile #email')).clear();
    element(by.css('#profile #mobile')).clear();
    element(by.css('#profile #address')).clear();
    element(by.css('#profile #state')).clear();
    element(by.css('#profile #city')).clear();
    element(by.css('#profile #postal')).clear();
  }

  getMyWallet() {
    return element(by.css('#wallet .panel.panel-default .panel-heading')).getText();
  }

  getProfile() {
    return element(by.css('#profile-content .panel.panel-default .panel-heading')).getText();
  }

  getProfileErrorAll() {
    this.clearText();
    let button = element(by.css('#profile .btn.btn-primary.btn-block.text-center'));
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('#profile .alert.alert-success')).isPresent(), 2000, 'long wait');
    return element(by.css('#profile .alert.alert-success')).getText();
  }
}