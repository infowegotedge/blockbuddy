import { browser, by, element } from 'protractor';

export class TeamCommunication {

  getInbox() {
    browser.sleep(500);
    return element(by.css('#inbox .btn.btn-secondary.btn-single')).getText();
  }

  getOutbox() {
    let tab = element(by.css('.nav.nav-tabs.custom-tabs li.active+li > a'));
    browser.actions().mouseMove(tab).click().perform();
    browser.wait(() => element(by.css('#outbox .btn.btn-secondary.btn-single')).isPresent(), 2000, 'long wait');
    return element(by.css('#outbox .btn.btn-secondary.btn-single')).getText();
  }

  getSendMail() {
    let tab = element(by.css('.nav.nav-tabs.custom-tabs li.active+li > a'));
    browser.actions().mouseMove(tab).click().perform();
    browser.wait(() => element(by.css('#send-message .btn.btn-secondary.btn-single')).isPresent(), 2000, 'long wait');
    return element(by.css('#send-message .btn.btn-secondary.btn-single')).getText();
  }

  getSendMailSubmitError() {
    let checkbox = element(by.css('.table.table-model-2 tbody tr:first-child > td > input[type="checkbox"]'));
    let subject  = element(by.css('#first-name'));
    let frame    = element(by.id('#text-editor_ifr'));
    let button   = element(by.css('#profile .btn.btn-primary.btn-block.text-center.mt18'));
    browser.actions().mouseMove(checkbox).click().perform();
    subject.sendKeys('Welcome Mail');
    // browser.switchTo().frame(frame);
    // let body = element(by.id('#tinymce'));
    // body.sendKeys('Hi There, How are you. Thanks Ravi Mehrotra');
    // browser.switchTo().defaultContent();
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('#send-message .alert.alert-danger')).isPresent(), 2000, 'long wait');
    return element(by.css('#send-message .alert.alert-danger')).getText();
  }
}