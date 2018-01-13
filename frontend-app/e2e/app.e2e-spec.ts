import { BBAppPage } from './app.po';
import { browser } from 'protractor';

describe('bb-app App', () => {
  let page: BBAppPage;

  beforeEach(() => {
    page = new BBAppPage();
  });

  it('should display message saying "Dear user, ..."', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toBe('Dear user, please fill the below details!');
  });

  it('should display "Signup Page And Error Messages"', () => {
    page.navigateTo();
    expect(page.getSignUp()).toBe('Create your account');
    expect(page.getSignUpBlankSubmit()).toBe(8);
  });

  it('should display "Signup Page And Error Field Fill"', () => {
    page.navigateTo();
    expect(page.getSignUp()).toBe('Create your account');
    expect(page.getSignupMobileError(69)).toBe('Please enter your mobile number. It must be 10 digit long.');
    expect(page.getSignupUsernameError(69)).toBe('User email or Username already exits.');
    expect(page.getSignupEmailError(null)).toBe('User email or Username already exits.');
    expect(page.getSignupPasswordError(null)).toBe('Please enter your Password');
  });

  it('should display "Signup Page Success Messages"', () => {
    page.navigateTo();
    expect(page.getSignUp()).toBe('Create your account');
    expect(page.getSignupSuccess()).toMatch('You have successfully register with us.');
  });

  it('should display "help block - Username is..."', async () => {
    page.navigateTo();
    expect(page.setLoginFailAndHelpBlockUsername('', '')).toBe('Username is required');
  });

  it('should display "help block - Password is..."', async () => {
    page.navigateTo();
    expect(page.setLoginFailAndHelpBlockPassword('ravi_kumar', '')).toBe('Password is required');
  });

  it('should display "wrong username and password"', async () => {
    page.navigateTo();
    expect(page.setLoginFailAndAlertMessage('ravimehrotra69', 'ravi2681!Q')).toBe('Username or Password is incorrect');
  });

  it('should display "Forget Password"', () => {
    page.navigateTo();
    let forgetPassword = page.getForgetPasswordComponent();
    expect(forgetPassword.getForgetPassword()).toBeTruthy();
    expect(forgetPassword.getForgetPasswordWithoutValue()).toBe('Email is required');
    expect(forgetPassword.getForgetPasswordWithValueError('sadfjasldfjaslf')).toBe('Email is required');
    expect(forgetPassword.getForgetPasswordWithValueError('@asfjdalsfjaslfj.co.in')).toBe('Email is required');
    expect(forgetPassword.getForgetPasswordWithValueError('google.co.in')).toBe('Email is required');
    expect(forgetPassword.getForgetPasswordWithValueEmailIsWrong('asdfasdfjlsfj@asdfjaslfj')).toBe('User not found.');
    expect(forgetPassword.getForgetPasswordWithValueEmailIsWrong('xyz_abc@xyz_abc.com')).toBe('Please enter your correct email');
    expect(forgetPassword.getForgetPasswordWithValue('ravi@allies.co.in')).toMatch('Password reset link has been sent to your email Id');
  });

  it('should display "Dashboard, ..."', () => {
    page.navigateTo();
    expect(page.setLogin('ravimehrotra69', 'ravi2681')).toMatch('CURRENT RATES');
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationMainLinks('main-mining')).toBe('Order');
    expect(page.getNavigationMainLinks('main-wallet')).toBe('Wallet Info');
    expect(page.getNavigationDashBoard()).toMatch('CURRENT RATES');
  });

  it('should display "Referral Pages"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationLinks('main-referral-links', 'sub-landing-pages')).toBe('Landing Pages');
    expect(page.getNavigationLinks('main-referral-links', 'sub-tree-placement')).toBe('Tree Placement');
    expect(page.getNavigationAddUser()).toBe('Create User');
  });

  it('should display "Promotions Pages"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationLinks('main-promotions', 'sub-bb-concept')).toBe('BB Concept');
    expect(page.getNavigationLinks('main-promotions', 'sub-promotion-banners')).toBe('Promotion Banners');
    expect(page.getNavigationLinks('main-promotions', 'sub-campaign')).toBe('Referral Campaign');
    expect(page.getNavigationLinks('main-promotions', 'sub-banner')).toBe('Banner Campaign');
  });

  it('should display "Networks Pages"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationLinks('main-networks', 'sub-affiliate')).toBe('Affiliates');
    expect(page.getNavigationLinks('main-networks', 'sub-my-team')).toBe('My Team');
    expect(page.getNavigationCommissionPage()).toBe('Commissions');
    expect(page.getNavigationLinks('main-networks', 'sub-team-communication')).toBe('Team Communication');
  });

  it('should display "Profile Pages"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationLinks('main-settings', 'sub-profile')).toBe('My Profile');
    browser.sleep(500);
    expect(page.getNavigationLinks('main-settings', 'sub-manage-otp')).toBe('Manage 2FA');
    browser.sleep(500);
    expect(page.getNavigationLinks('main-settings', 'sub-change-password')).toBe('Change Password');
  });

  it('should display "Landing Pages"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationLinks('main-referral-links', 'sub-landing-pages')).toBe('Landing Pages');
    expect(page.getLandingPages()).toMatch('Your default landing page is');
  });

  it('should display "Tree Placement"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationLinks('main-referral-links', 'sub-tree-placement')).toBe('Tree Placement');
    expect(page.getTreePlacement()).toMatch('Tree Placement Updated.');
  });

  it('should display "Create User"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationAddUser()).toBe('Create User');
    expect(page.getCreateUser()).toMatch('User added successfully');
  });

  it('should display "Change Password"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationLinks('main-settings', 'sub-change-password')).toBe('Change Password');
    expect(page.getChangePassword()).toBe(3);
    expect(page.getChangePasswordErrorConfirm('ravi2681', 'ravi2681', 'ravi2681!Q')).toBe('Password Mismatch');
  });

  it('should display "Change Password Submit"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationLinks('main-settings', 'sub-change-password')).toBe('Change Password');
    expect(page.getChangePasswordErrorInput('fs12312', 'ravi2681', 'ravi2681')).toBe('Invalid Old Password');
    expect(page.getChangePasswordConfirm('ravi2681', 'ravi2681', 'ravi2681')).toBe('Password changed successfully');
  });

  it('should display "Affiliation Page"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationLinks('main-networks', 'sub-affiliate')).toBe('Affiliates');
    expect(page.getAffiliates().getAffiliatesButton()).toBe('Choose your payment option');
    expect(page.getAffiliates().getAffiliationNoPaymentMethodError()).toBe('Please select one of the above payment method.');
    expect(page.getAffiliates().getAffiliationSelectRadioAndSubmit()).toMatch('INVOICE');
    expect(page.getAffiliates().getAffiliationPopupCloseButton()).toMatch('PENDING');

    expect(page.getAffiliates().getAffiliatesButton()).toBe('Enter your Hash Address');
    expect(page.getAffiliates().getAffiliatesSubmitWithoutHash()).toBe('BTC Hash is required');
    expect(page.getAffiliates().getAffiliatesHashAndSubmit()).toMatch('You have successfully submit your request');
    expect(page.getAffiliates().getAffiliationProcessingStatus()).toMatch('PROCESSING');
  });

  it('should display "Banner Page"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationLinks('main-promotions', 'sub-banner')).toBe('Banner Campaign');
    expect(page.getBanners().getBannersCampaign()).toBe('Banner Campaigns');
    expect(page.getBanners().getCreateBanner()).toBe('Create Banner');
    expect(page.getBanners().getCreateBannerFormInvalid()).toBe('Banner name is required');
    expect(page.getBanners().getCreateBannerFormAndSubmit()).toBe('Banner created successfully.');
    expect(page.getBanners().getDeleteButton()).toBe('Banner Delete!!!');
    expect(page.getBanners().getDeleteCancelButton()).toBeFalsy();
    expect(page.getBanners().getDeleteConfirmButton()).toBe('No Banner Campaign Found');
    expect(page.getBanners().getBannersReport()).toBe('Banner Reports');
  });

  it('should display "Campaign Page"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationLinks('main-promotions', 'sub-campaign')).toBe('Referral Campaign');
    expect(page.getCampaigns().getCampaign()).toBe('Referral Campaigns');
    expect(page.getCampaigns().getCreateCampaign()).toBe('Create Campaign');
    expect(page.getCampaigns().getCreateCampaignFormInvalid()).toBe('Campaign name is required');
    expect(page.getCampaigns().getCreateCampaignFormAndSubmit()).toBe('Campaign created successfully.');
    expect(page.getCampaigns().getDeleteButton()).toBe('Campaign Delete!!!');
    expect(page.getCampaigns().getDeleteCancelButton()).toBeFalsy();
    expect(page.getCampaigns().getDeleteConfirmButton()).toBe('No Referral Link Found');
    expect(page.getCampaigns().getCampaignsReport()).toBe('Referral Reports');
  });

  it('should display "BlockBuddy Concept Page"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationLinks('main-promotions', 'sub-bb-concept')).toBe('BB Concept');
    let bbConcept = page.getBBConceptPages();
    expect(bbConcept.getConceptPage('#video')).toBe('Videos');
    expect(bbConcept.getConceptPage('#pdf')).toBe('PDF\'s');
    expect(bbConcept.getEmailPage()).toBe('Email Templates');
    expect(bbConcept.getSMSPage()).toBe('SMS Blast');
    expect(bbConcept.getFBMessagePage()).toBe('FB Messages');
    expect(bbConcept.getSocialTab1Page()).toBe('Social Blast');
    expect(bbConcept.getSocialTab2Page()).toBe('Social Groups');
  });

  it('should display "My Team Page"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationLinks('main-networks', 'sub-my-team')).toBe('My Team');
    let teamPages = page.getMyTeamPages();
    expect(teamPages.getDirects()).toBe('Total Purchased PV');
    expect(teamPages.getLeaderBoard()).toBe('Last 30 Days');
    expect(teamPages.getMyTeam()).toBe('Sponsor Name');
    expect(teamPages.getMyNetworks()).toBe('Search');
  });

  it('should display "Commission Page"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationCommissionPage()).toBe('Commissions');
    let commissionPage = page.getCommissionPages();
    expect(commissionPage.getCommissions()).toBe('Commissions');
  });

  it('should display "Team Communication Page"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationLinks('main-networks', 'sub-team-communication')).toBe('Team Communication');
    let communication = page.getTeamCommunicationPages();
    expect(communication.getInbox()).toBe('Search');
    expect(communication.getOutbox()).toBe('Search');
    expect(communication.getSendMail()).toBe('Search');
    expect(communication.getSendMailSubmitError()).toBe('Please enter your message');
    // expect(communication.getSendMailSubmit()).toBe('Message sent successfully.');
  });

  it('should display "My Profile Page"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getNavigationLinks('main-settings', 'sub-profile')).toBe('My Profile');
    let profile = page.getProfile();
    expect(profile.getMyWallet()).toMatch('Update Wallet');
    expect(profile.getProfile()).toMatch('Update Profile');
    expect(profile.getProfileErrorAll()).toBe('Profile Updated Successfully');
  });

  it('should display "Logout"', () => {
    page.navigateTo();
    expect(page.getNavigation()).toBeTruthy();

    // Navigation
    expect(page.getHeaderNavigationProfile('header-profile')).toBe('My Profile');
    expect(page.getHeaderNavigationLogout('header-logout')).toBe('Dear user, please fill the below details!');
  });
});