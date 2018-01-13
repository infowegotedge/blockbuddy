import { browser, by, element } from 'protractor';

export class Commissions {

  getCommissions() {
    return element(by.css('.pop-up-overlay > .pop-up > h3')).getText();
  }
}