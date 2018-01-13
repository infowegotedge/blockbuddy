import { browser, by, element } from 'protractor';
import { ForgetPassword } from './app.forgetpassword';
import { Affiliation } from './app.affiliation';
import { Banners } from './app.banners';
import { Campaigns } from './app.campaign';
import { BlockBuddyConcept } from './app.bbconcept';
import { MyTeam } from './app.myteam';
import { Commissions } from './app.commission';
import { TeamCommunication } from './app.team-communication';
import { ProfilePages } from './app.profile';

export class BBAppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root .login-form .login-header p')).getText();
  }

  getForgetPasswordComponent() {
    return new ForgetPassword();
  }

  getSignUp() {
    let aTag = element(by.css('.full-width.mb20 > .signup'));
    browser.actions().mouseMove(aTag).click().perform();
    browser.wait(() => element(by.css('#signup .login-header.text-center > p')).isPresent(), 2000, 'long wait')
    return element(by.css('#signup .login-header.text-center > p')).getText();
  }

  getSignUpBlankSubmit() {
    let button = element(by.css('#signup .form-group > .btn.btn-primary.btn-block.text-center'));
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('#username + .help-block')).isPresent(), 2000, 'long wait')
    return element.all(by.css('.help-block')).count();
  }

  getSignupMobileError(value) {
    value = (value || (new Date()).getTime());
    element(by.css('input#username')).clear();
    element(by.css('input#first-name')).clear();
    element(by.css('input#last-name')).clear();
    element(by.css('input#email')).clear();
    element(by.css('input#mobile')).clear();
    element(by.css('input#new-password')).clear();
    element(by.css('input#confirm-password')).clear();

    element(by.css('input#username')).sendKeys('ravimehrotra' + value);
    element(by.css('input#first-name')).sendKeys('ravi');
    element(by.css('input#last-name')).sendKeys('mehrotra');
    element(by.css('input#email')).sendKeys('ravi' + value + '@allies.co.in');
    element(by.css('input#mobile')).sendKeys(value);
    element(by.css('select#country')).sendKeys('India');
    element(by.css('input#new-password')).sendKeys('ravi' + value);
    element(by.css('input#confirm-password')).sendKeys('ravi' + value);

    let createUserButton = element(by.css('.btn.btn-primary.btn-block.text-center'));
    browser.actions().mouseMove(createUserButton).click().perform();
    browser.wait(() => element(by.css('#signup > .alert.alert-danger')).isPresent(), 2000, 'long wait');
    return element(by.css('#signup > .alert.alert-danger')).getText();
  }

  getSignupUsernameError(value) {
    value = (value || (new Date()).getTime());
    element(by.css('input#username')).clear();
    element(by.css('input#first-name')).clear();
    element(by.css('input#last-name')).clear();
    element(by.css('input#email')).clear();
    element(by.css('input#mobile')).clear();
    element(by.css('input#new-password')).clear();
    element(by.css('input#confirm-password')).clear();

    element(by.css('input#username')).sendKeys('ravimehrotra' + value);
    element(by.css('input#first-name')).sendKeys('ravi');
    element(by.css('input#last-name')).sendKeys('mehrotra');
    element(by.css('input#email')).sendKeys('ravi' + value + '@allies.co.in');
    element(by.css('input#mobile')).sendKeys('+91234567890');
    element(by.css('select#country')).sendKeys('India');
    element(by.css('input#new-password')).sendKeys('ravi' + value);
    element(by.css('input#confirm-password')).sendKeys('ravi' + value);

    let createUserButton = element(by.css('.btn.btn-primary.btn-block.text-center'));
    browser.actions().mouseMove(createUserButton).click().perform();
    browser.wait(() => element(by.css('#signup > .alert.alert-danger')).isPresent(), 2000, 'long wait');
    return element(by.css('#signup > .alert.alert-danger')).getText();
  }

  getSignupEmailError(value) {
    value = (value || (new Date()).getTime());
    element(by.css('input#username')).clear();
    element(by.css('input#first-name')).clear();
    element(by.css('input#last-name')).clear();
    element(by.css('input#email')).clear();
    element(by.css('input#mobile')).clear();
    element(by.css('input#new-password')).clear();
    element(by.css('input#confirm-password')).clear();

    element(by.css('input#username')).sendKeys('ravimehrotra' + value);
    element(by.css('input#first-name')).sendKeys('ravi');
    element(by.css('input#last-name')).sendKeys('mehrotra');
    element(by.css('input#email')).sendKeys('ravi@allies.co.in');
    element(by.css('input#mobile')).sendKeys('+91234567890');
    element(by.css('select#country')).sendKeys('India');
    element(by.css('input#new-password')).sendKeys('ravi11231');
    element(by.css('input#confirm-password')).sendKeys('ravi11231');

    let createUserButton = element(by.css('.btn.btn-primary.btn-block.text-center'));
    browser.actions().mouseMove(createUserButton).click().perform();
    browser.wait(() => element(by.css('#signup > .alert.alert-danger')).isPresent(), 2000, 'long wait');
    return element(by.css('#signup > .alert.alert-danger')).getText();
  }

  getSignupPasswordError(value) {
    value = (value || (new Date()).getTime());
    element(by.css('input#username')).clear();
    element(by.css('input#first-name')).clear();
    element(by.css('input#last-name')).clear();
    element(by.css('input#email')).clear();
    element(by.css('input#mobile')).clear();
    element(by.css('input#new-password')).clear();
    element(by.css('input#confirm-password')).clear();

    element(by.css('input#username')).sendKeys('ravimehrotra' + value);
    element(by.css('input#first-name')).sendKeys('ravi');
    element(by.css('input#last-name')).sendKeys('mehrotra');
    element(by.css('input#email')).sendKeys('ravi@allies.co.in');
    element(by.css('input#mobile')).sendKeys('+91234567890');
    element(by.css('select#country')).sendKeys('India');
    element(by.css('input#new-password')).sendKeys('ravi' + value);
    element(by.css('input#confirm-password')).sendKeys('ravi' + value);

    let createUserButton = element(by.css('.btn.btn-primary.btn-block.text-center'));
    browser.actions().mouseMove(createUserButton).click().perform();
    browser.wait(() => element(by.css('#signup > .alert.alert-danger')).isPresent(), 2000, 'long wait');
    return element(by.css('#signup > .alert.alert-danger')).getText();
  }

  getSignupSuccess() {
    let newDate = (new Date()).getTime();
    element(by.css('input#username')).sendKeys('ravimehrotra' + newDate);
    element(by.css('input#first-name')).sendKeys('ravi');
    element(by.css('input#last-name')).sendKeys('mehrotra');
    element(by.css('input#email')).sendKeys('ravi' + newDate + '@allies.co.in');
    element(by.css('input#mobile')).sendKeys('+911234567890');
    element(by.css('select#country')).sendKeys('India');
    element(by.css('input#new-password')).sendKeys('ravi2681');
    element(by.css('input#confirm-password')).sendKeys('ravi2681');

    let createUserButton = element(by.css('.btn.btn-primary.btn-block.text-center'));
    browser.actions().mouseMove(createUserButton).click().perform();
    browser.wait(() => element(by.css('.login-container .login-header .alert.alert-success')).isPresent(), 2000, 'long wait');
    return element(by.css('.login-container .login-header .alert.alert-success')).getText();
  }

  setLoginFailAndHelpBlockUsername(username, password) {
    element(by.css('input[placeholder="Username"]')).sendKeys(username);
    element(by.css('input[placeholder="Password"]')).sendKeys(password);
    let loginButton = element(by.css('.btn.btn-primary.btn-block'));
    browser.actions().mouseMove(loginButton).click().perform();
    return element(by.css('input[placeholder="Username"] + .help-block')).getText();
  }

  setLoginFailAndHelpBlockPassword(username, password) {
    element(by.css('input[placeholder="Username"]')).sendKeys(username);
    element(by.css('input[placeholder="Password"]')).sendKeys(password);
    let loginButton = element(by.css('.btn.btn-primary.btn-block'));
    browser.actions().mouseMove(loginButton).click().perform();
    return element(by.css('input[placeholder="Password"] + .help-block')).getText();
  }

  setLoginFailAndAlertMessage(username, password) {
    element(by.css('input[placeholder="Username"]')).sendKeys(username);
    element(by.css('input[placeholder="Password"]')).sendKeys(password);
    let loginButton = element(by.css('.btn.btn-primary.btn-block'));
    browser.actions().mouseMove(loginButton).click().perform();
    browser.wait(() => element(by.css('.alert.alert-danger.pull-left.full-width')).isPresent(), 2000, 'long wait');
    return element(by.css('.alert.alert-danger.pull-left.full-width')).getText();
  }

  setLogin(username, password) {
    element(by.css('input[placeholder="Username"]')).sendKeys(username);
    element(by.css('input[placeholder="Password"]')).sendKeys(password);
    let loginButton = element(by.css('.btn.btn-primary.btn-block'));
    browser.actions().mouseMove(loginButton).click().perform();
    browser.wait(() => element(by.css('.top-section')).isPresent(), 20000, 'long wait');
    return element(by.css('.top-section')).getText();
  }

  getNavigation() {
    return element(by.css('#main-menu')).isPresent();
  }

  getHeaderNavigationProfile(navName) {
    let refferalLink   = element(by.css('.user-info-navbar .user-info-menu .user-profile'));
    let navigationName = element(by.css('#' + navName));
    browser.actions().mouseMove(refferalLink).click().perform();
    browser.sleep(50);
    browser.actions().mouseMove(navigationName).click().perform();
    browser.sleep(100);
    return element(by.css('.title-env .title')).getText();
  }

  getHeaderNavigationLogout(navName) {
    let refferalLink   = element(by.css('.user-info-navbar .user-info-menu .user-profile'));
    let navigationName = element(by.css('#' + navName));
    browser.actions().mouseMove(refferalLink).click().perform();
    browser.sleep(50);
    browser.actions().mouseMove(navigationName).click().perform();
    browser.wait(() => element(by.css('app-root .login-form .login-header p')).isPresent(), 20000, 'long wait');
    return element(by.css('app-root .login-form .login-header p')).getText();
  }

  getNavigationDashBoard() {
    let refferalLink   = element(by.css('#main-dashboard'));
    browser.actions().mouseMove(refferalLink).click().perform();
    browser.sleep(50);
    return element(by.css('.top-section')).getText();
  }

  getNavigationMainLinks(mainId) {
    let refferalLink   = element(by.css('#' + mainId));
    browser.actions().mouseMove(refferalLink).click().perform();
    browser.sleep(50);
    return element(by.css('.title-env .title')).getText();
  }

  getNavigationLinks(mainId, navName) {
    let refferalLink   = element(by.css('#' + mainId));
    let navigationName = element(by.css('#' + navName));
    browser.actions().mouseMove(refferalLink).click().perform();
    browser.sleep(50);
    browser.actions().mouseMove(navigationName).click().perform();
    browser.sleep(100);
    return element(by.css('.title-env .title')).getText();
  }

  getNavigationCommissionPage() {
    let refferalLink   = element(by.css('#main-networks'));
    let navigationName = element(by.css('#sub-commissions'));
    browser.actions().mouseMove(refferalLink).click().perform();
    browser.sleep(50);
    browser.actions().mouseMove(navigationName).click().perform();
    browser.sleep(50);
    return element(by.css('.pop-up-overlay > .pop-up > h3')).getText();
  }

  getNavigationAddUser() {
    let refferalLink = element(by.css('#main-referral-links'));
    let addUser = element(by.css('#sub-add-user'));
    browser.actions().mouseMove(refferalLink).click().perform();
    browser.sleep(50);
    browser.actions().mouseMove(addUser).click().perform();
    browser.sleep(50);
    return element(by.css('.xe-widget.xe-todo-list .xe-header .text-center > h3')).getText();
  }

  getLandingPages() {
    let refferalLink  = element(by.css('.panel-body .table.table-model-2.table-hover > tbody > tr button'));
    let refferalLink1 = element(by.css('.panel-body .table.table-model-2.table-hover > tbody > tr + tr button'));
    browser.actions().mouseMove(refferalLink).click().perform();
    browser.actions().mouseMove(refferalLink1).click().perform();
    browser.wait(() => element(by.css('.alert.alert-success > .panel-title')).isPresent(), 2000, 'long wait');
    return element(by.css('.alert.alert-success > .panel-title')).getText();
  }

  getTreePlacement() {
    let treePlacement  = element(by.css('.panel-body .form-horizontal > div[data-toggle="buttons"]'));
    let treePlacement1 = element(by.css('.panel-body .form-horizontal > div[data-toggle="buttons"] + div[data-toggle="buttons"]'));
    browser.actions().mouseMove(treePlacement).click().perform();
    browser.actions().mouseMove(treePlacement1).click().perform();
    browser.wait(() => element(by.css('.alert.alert-success > .panel-title')).isPresent(), 2000, 'long wait');
    return element(by.css('.alert.alert-success > .panel-title')).getText();
  }

  getCreateUser() {
    let newDate = (new Date()).getTime();
    element(by.css('input#username')).sendKeys('ravimehrotra' + newDate);
    element(by.css('input#first-name')).sendKeys('ravi');
    element(by.css('input#last-name')).sendKeys('mehrotra');
    element(by.css('input#email')).sendKeys('ravi' + newDate + '@allies.co.in');
    element(by.css('input#mobile')).sendKeys('+911234567890');
    element(by.css('select#country')).sendKeys('India');
    element(by.css('input#password')).sendKeys('ravi2681');
    element(by.css('input#confirm-password')).sendKeys('ravi2681');

    let elementL = element(by.css('input[value="L"]'));
    browser.actions().mouseMove(elementL).click().perform();
    browser.sleep(50);

    let createUserButton = element(by.css('.btn.btn-primary.btn-block.text-center'));
    browser.actions().mouseMove(createUserButton).click().perform();
    browser.wait(() => element(by.css('#user-add-success')).isPresent(), 2000, 'long wait');
    return element(by.css('#user-add-success')).getText();
  }

  getChangePassword() {
    let button = element(by.css('#profile .btn.btn-primary.btn-block.text-center'));
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('#profile .help-block')).isPresent(), 2000, 'long wait');
    return element.all(by.css('#profile .help-block')).count();
  }

  getChangePasswordErrorConfirm(oldPass, newPass, confirmPass) {
    element(by.css('#old-password')).clear();
    element(by.css('#new-password')).clear();
    element(by.css('#confirm-password')).clear();

    element(by.css('#old-password')).sendKeys(oldPass);
    element(by.css('#new-password')).sendKeys(newPass);
    element(by.css('#confirm-password')).sendKeys(confirmPass);

    let button = element(by.css('#profile .btn.btn-primary.btn-block.text-center'));
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('#confirm-password + .help-block')).isPresent(), 2000, 'long wait');
    return element(by.css('#confirm-password + .help-block')).getText();
  }

  getChangePasswordErrorInput(oldPass, newPass, confirmPass) {
    element(by.css('#old-password')).clear();
    element(by.css('#new-password')).clear();
    element(by.css('#confirm-password')).clear();

    element(by.css('#old-password')).sendKeys(oldPass);
    element(by.css('#new-password')).sendKeys(newPass);
    element(by.css('#confirm-password')).sendKeys(confirmPass);

    let button = element(by.css('#profile .btn.btn-primary.btn-block.text-center'));
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('#profile .alert.alert-danger > h4')).isPresent(), 2000, 'long wait');
    return element(by.css('#profile .alert.alert-danger > h4')).getText();
  }

  getChangePasswordConfirm(oldPass, newPass, confirmPass) {
    element(by.css('#old-password')).clear();
    element(by.css('#new-password')).clear();
    element(by.css('#confirm-password')).clear();

    element(by.css('#old-password')).sendKeys(oldPass);
    element(by.css('#new-password')).sendKeys(newPass);
    element(by.css('#confirm-password')).sendKeys(confirmPass);

    let button = element(by.css('#profile .btn.btn-primary.btn-block.text-center'));
    browser.actions().mouseMove(button).click().perform();
    browser.wait(() => element(by.css('#profile .alert.alert-success > h4')).isPresent(), 2000, 'long wait');
    return element(by.css('#profile .alert.alert-success > h4')).getText();
  }

  getAffiliates() {
    return new Affiliation();
  }

  getBanners() {
    return new Banners();
  }

   getCampaigns() {
    return new Campaigns();
  }

  getBBConceptPages() {
    return new BlockBuddyConcept();
  }

  getMyTeamPages() {
    return new MyTeam();
  }

  getCommissionPages() {
    return new Commissions();
  }

  getTeamCommunicationPages() {
    return new TeamCommunication();
  }

  getProfile() {
    return new ProfilePages();
  }
}
