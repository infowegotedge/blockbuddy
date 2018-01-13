import { browser, by, element } from 'protractor';

export class BlockBuddyConcept {

  private getNextTab() {
    let aTab = element(by.css('.nav.nav-tabs.custom-tabs li.active + li'));
    browser.actions().mouseMove(aTab).click().perform();
    browser.sleep(500);
  }

  getConceptPage(tabPage) {
    let aTab = element(by.css('#home a[href="' + tabPage + '"]'));
    browser.actions().mouseMove(aTab).click().perform();
    browser.wait(() => element(by.css('#home .tab-pane.active .pop-up.popup-width > h3')).isPresent(), 2000, 'long wait')
    return element(by.css('#home .tab-pane.active .pop-up.popup-width > h3')).getText();
  }

  getEmailPage() {
    this.getNextTab();

    browser.wait(() => element(by.css('#email .pop-up.popup-width > h3')).isPresent(), 2000, 'long wait')
    return element(by.css('#email .pop-up.popup-width > h3')).getText();
  }

  getSMSPage() {
    this.getNextTab();

    browser.wait(() => element(by.css('#sms .pop-up.popup-width > h3')).isPresent(), 2000, 'long wait')
    return element(by.css('#sms .pop-up.popup-width > h3')).getText();
  }

  getFBMessagePage() {
    this.getNextTab();

    browser.wait(() => element(by.css('#fb-messages .pop-up.popup-width > h3')).isPresent(), 2000, 'long wait')
    return element(by.css('#fb-messages .pop-up.popup-width > h3')).getText();
  }

  getSocialTab1Page() {
    this.getNextTab();

    browser.wait(() => element(by.css('#blast .pop-up.popup-width > h3')).isPresent(), 2000, 'long wait')
    return element(by.css('#blast .pop-up.popup-width > h3')).getText();
  }

  getSocialTab2Page() {
    let aTab = element(by.css('#social a[href="#groups"]'));
    browser.actions().mouseMove(aTab).click().perform();
    browser.wait(() => element(by.css('#groups .pop-up.popup-width > h3')).isPresent(), 2000, 'long wait')
    return element(by.css('#groups .pop-up.popup-width > h3')).getText();
  }
}