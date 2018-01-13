import { browser, by, element } from 'protractor';

export class Affiliation {

  getAffiliatesButton() {
    let button = element(by.css('.btn.btn-success.full-width'));
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('.modal-title')).isPresent(), 1000, 'long wait');
    return element(by.css('.modal-title')).getText();
  }

  getAffiliationNoPaymentMethodError() {
    let button = element(by.css('.print-modal .modal-footer .btn.btn-primary'));
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('.modal-body .help-block')).isPresent(), 1000, 'long wait');
    return element(by.css('.modal-body .help-block')).getText();
  }

  getAffiliationSelectRadioAndSubmit() {
    let radio  = element(by.css('.form-group input[value="bitcoin"]'));
    let button = element(by.css('#order > .modal-footer > .btn.btn-primary'));
    browser.actions().mouseMove(radio).click().perform();
    browser.sleep(50);

    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('#order .invoice-number')).isPresent(), 4000, 'long wait');
    return element(by.css('#order .invoice-number')).getText();
  }

  getAffiliationPopupCloseButton() {
    let button = element(by.css('#order > .modal-footer > .btn.btn-danger'));
    browser.actions().mouseMove(button).click().perform();
    browser.sleep(1000);
    return element(by.css('.table.table-model-2.table-hover .label.label-warning')).getText();
  }

  getAffiliatesSubmitWithoutHash() {
    let button = element(by.css('.modal-footer .btn.btn-primary'));
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('#hash-address+.help-block')).isPresent(), 1000, 'long wait');
    return element(by.css('#hash-address+.help-block')).getText();
  }

  getAffiliatesHashAndSubmit() {
    let hashAddress = element(by.css('#hash-address'));
    let button = element(by.css('.modal-footer .btn.btn-primary'));
    hashAddress.sendKeys('sdjfalksfj23o42398rya9earu2394729312uoafasof293u');
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('.modal-body .alert.alert-success')).isPresent(), 1000, 'long wait');
    return element(by.css('.modal-body .alert.alert-success')).getText();
  }

  getAffiliationProcessingStatus() {
    browser.sleep(4000);
    return element(by.css('.table.table-model-2.table-hover .label.label-warning')).getText();
  }
}