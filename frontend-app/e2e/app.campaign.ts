import { browser, by, element } from 'protractor';

export class Campaigns {
  private campaign() {
    return element(by.css('.nav.nav-tabs.custom-tabs > li.active > a')).getText();
  }

  getCampaign() {
    browser.sleep(2000);
    return this.campaign();
  }

  getCreateCampaign() {
    let button = element(by.css('.tab-content .panel-options .btn.btn-primary'));
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('.modal.fade.in .modal-title')).isPresent(), 2000, 'long wait');
    return element(by.css('.modal.fade.in .modal-title')).getText();
  }

  getCreateCampaignFormInvalid() {
    let button = element(by.css('.modal-body .btn.btn-primary'));
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('.modal-body .form-group .help-block')).isPresent(), 2000, 'long wait');
    return element(by.css('.modal-body .form-group .help-block')).getText();
  }

  getCreateCampaignFormAndSubmit() {
    let textButton  = element(by.css('.modal-body input[name="name"]'));
    let radioButton = element(by.css('.modal-body input[type="radio"]'));
    let button      = element(by.css('.modal-body .btn.btn-primary'));

    textButton.sendKeys('banner one');
    browser.actions().mouseMove(radioButton).click().perform();
    browser.sleep(50);

    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('.modal-body form .alert.alert-success')).isPresent(), 2000, 'long wait');
    return element(by.css('.modal-body form .alert.alert-success')).getText();
  }

  getDeleteButton() {
    browser.sleep(3050);
    let delButton = element(by.css('.panel-body .table.table-striped .btn.btn-danger.btn-icon'));
    browser.actions().mouseMove(delButton).click().perform();
    browser.sleep(500);
    return element(by.css('.popover > .popover-title')).getText();
  }

  getDeleteCancelButton() {
    let delButton = element(by.css('.panel-body .popover-content .btn.btn-block.btn-default'));
    browser.actions().mouseMove(delButton).click().perform();
    browser.sleep(500);
    return element(by.css('.popover > .popover-title')).isPresent();
  }

  getDeleteConfirmButton() {
    let delButton = element(by.css('.panel-body .table.table-striped .btn.btn-danger.btn-icon'));
    browser.actions().mouseMove(delButton).click().perform();

    let confimButton = element(by.css('.panel-body .popover-content .btn.btn-block.btn-danger'));
    browser.actions().mouseMove(confimButton).click().perform();

    return element(by.css('.panel-body .table.table-striped tbody .text-center')).getText();
  }

  getCampaignsReport() {
    let button = element(by.css('.nav.nav-tabs.custom-tabs > li + li > a'))
    browser.actions().mouseMove(button).click().perform();
    browser.sleep(500);
    return element(by.css('.tab-pane.active .panel.panel-default .panel-title')).getText()
  }
}