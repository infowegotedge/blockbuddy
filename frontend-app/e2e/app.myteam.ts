import { browser, by, element } from 'protractor';

export class MyTeam {

  getDirects() {
    browser.sleep(500);
    return element(by.css('#directs .table.table-model-2 thead > tr > th+th+th+th+th')).getText();
  }

  getLeaderBoard() {
    let tab = element(by.css('.nav.nav-tabs.custom-tabs li.active+li > a'));
    browser.actions().mouseMove(tab).click().perform();
    browser.wait(() => element(by.css('#leaderboard .table.table-model-2 thead > tr > th+th+th')).isPresent(), 2000, 'long wait');
    return element(by.css('#leaderboard .table.table-model-2 thead > tr > th+th+th')).getText();
  }

  getMyTeam() {
    let tab = element(by.css('.nav.nav-tabs.custom-tabs li.active+li > a'));
    browser.actions().mouseMove(tab).click().perform();
    browser.wait(() => element(by.css('#team .table.table-model-2 thead > tr > th+th+th')).isPresent(), 2000, 'long wait');
    return element(by.css('#team .table.table-model-2 thead > tr > th+th+th')).getText();
  }

  getMyNetworks() {
    let tab = element(by.css('.nav.nav-tabs.custom-tabs li.active+li > a'));
    browser.actions().mouseMove(tab).click().perform();
    browser.wait(() => element(by.css('#network #search-downline .btn.btn-secondary.btn-single')).isPresent(), 2000, 'long wait');
    return element(by.css('#network #search-downline .btn.btn-secondary.btn-single')).getText();
  }
}