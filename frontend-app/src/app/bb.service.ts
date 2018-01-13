import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'ngx-webstorage';
import { WindowRef } from './app.windows';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from "angular4-social-login";
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL  = environment.apiURL;
const TRADING_API_URL = environment.tradingApiURL;
let ErrorScope = null;

@Injectable()
export class BBService {

  private loggedIn = false;
  private userRole: string;
  private authToken: string;
  private tradeToken: string;
  private authToken1: string;
  private tradeToken1: string;
  private finalAuth: string;
  private finalTrade: string;
  private headers: any = new Headers();

  constructor(
    private http: Http,
    private localStorage: LocalStorageService,
    private _windows: WindowRef,
    private authService: AuthService
  ) {

    this.authToken = localStorage.retrieve('token');
    this.tradeToken = localStorage.retrieve('trade');
    this.authToken1 = localStorage.retrieve('exto');
    this.tradeToken1 = localStorage.retrieve('xtrade');
    this.finalAuth  = (this.authToken1 || this.authToken);
    this.finalTrade = (this.tradeToken1 || this.tradeToken);
    this.headers.append('Authorization', this.finalAuth);
    this.headers.append('traderauth', this.finalTrade);
    this.loggedIn = !!this.authToken;
    this.userRole = localStorage.retrieve('role');
    ErrorScope = this;
  }

  // Social Auth Service
  getAuthService() {
    return this.authService;
  }

  // User Login
  login(username, password) {
    var userData = {username:username, password: password};
    return this.http.post(`${API_URL}/auth/login`, userData)
            .map((response: Response) => response.json())
            .catch(this.handleError)
  }

  // Login as user By Admin
  loginAsUser(userData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/admin/login-as-user`, userData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError)
  }

  //  Register User
  register(userData) {
    return this.http.post(`${API_URL}/auth`, userData)
            .map((response: Response) => response.json())
            .catch(this.handleError)
  }

  // Social Login Or Register
  loginOrRegister(data) {
    return this.http.post(`${API_URL}/auth/social`, data)
           .map((response: Response) => response.json())
           .catch(this.handleError);
  }

  // Add User
  addUser(userData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/add-user`, userData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError)
  }

  // Add User
  resumeLogin() {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/resume`, {}, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError)
  }

  // Get User Info
  getProfile() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/me`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Is Logged In Or Not
  isLoggedIn() {
    return this.loggedIn;
  }

  // Get Role is Admin Or Not
  getRole() {
    if (this.userRole === 'admin' || this.userRole === 'moderator' || this.userRole === 'supervisor') {
      return true;
    }else {
      return false;
    }
  }

  // Serialize Object
  serializeObject(keys) {
    let params: URLSearchParams = new URLSearchParams();
    for(let idx in keys) {
      if(keys.hasOwnProperty(idx)) {
        params.set(idx, keys[idx]);
      }
    }
    return params;
  }

  // Update User Info
  updateProfile(data) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/profile`, data, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Update User Wallet
  updateWallet(data) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/wallet/btc-info/update`, data, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Create BTC Address
  createBtcAddress(data) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/wallet/btc-info/create`, data, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get User Wallet address
  btcAddress() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/wallet/btc-info/address`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Change Password
  changePassword(userData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/change-password`, userData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get BTC Amount
  btcInfo() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/wallet/btc-info`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get USD Amount
  usdInfo() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/wallet/usd-info`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Campaign List
  getCampaignList() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/campaign/list?page=1&limit=25`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Delete Commission
  deleteCommission(commissionData) {
    let headers = this.headers;
    let options = new RequestOptions ({
      headers: headers,
      body: commissionData
    });

    return this.http.delete(`${API_URL}/api/admin/commission/delete`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  deleteProducts(productData) {
    let headers = this.headers;
    let options = new RequestOptions ({
      headers: headers,
      body: {}
    });
    console.log(options, `${TRADING_API_URL}/product/` + productData);
    return this.http.delete(`${TRADING_API_URL}/product/` + productData, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Referral Links
  getReferralLinks() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/referral-links`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get My Directs
  getMyDirects(_currentPage) {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/directs?page=`+_currentPage, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get My Directs
  getMyDownline(_currentPage) {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/downline?page=`+_currentPage, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Current Rates
  getCurrentRates() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/current-rates`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Total Income
  getTotalIncome() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/total-income`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Latest Signups
  getLatestSignups() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/latest-signup`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Mining Packages
  getPackages() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/package`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Virtual Tree
  getVirtualTree() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/virtualtree`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Purchase Token
  getPurchaseToken() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/purchase`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Process Order
  processOrder(orderData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/purchase/create`, orderData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Booking Order
  bookOrder(purchaseData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/payments`, purchaseData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Booking Order From Expay
  bookOrderExPay(purchaseData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/payments`, purchaseData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Booking Order From Expay
  bookOrderPayza(purchaseData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/payments/payza`, purchaseData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Update User Avatar
  changeAvatar(imageData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/upload`, imageData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError)
  }

  // Forgot Password
  forgotPassword(passwordData) {
    return this.http.post(`${API_URL}/auth/forgot-password`, passwordData)
            .map((response: Response) => response.json())
            .catch(this.handleError)
  }

  // Reset Password
  resetPassword(resetData) {
    return this.http.post(`${API_URL}/auth/change-password`, resetData)
            .map((response: Response) => response.json())
            .catch(this.handleError)
  }

  // Visit Banner
  visitAffiliates(visitData) {
    return this.http.post(`${API_URL}/api/affiliates-visit`, visitData)
            .map((response: Response) => response.json())
            .catch(this.handleError)
  }

  // Visit Banner
  topAffiliates() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/top-affiliates`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError)
  }

  // Visit Banner
  listCommissions() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/wallet/commission-list`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError)
  }

  // Get Country Info
  getCountryInfo() {
    return this.http.get('assets/js/countryFlag.json')
           .map((response: Response) => response.json())
           .catch(this.handleError)
  }

  // Get Country Info
  getWordMapData() {
    return this.http.get('assets/js/wordmap.json')
           .map((response: Response) => response.json())
           .catch(this.handleError)
  }

  // Get Country Flag Code Based On Country Name
  countryFlag() {
    return this.http.get('assets/js/countryToCode.json')
           .map((response: Response) => response.json())
           .catch(this.handleError)
  }

  // Get My Team
  myTeam(_currentPage) {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/users/total-users?page=`+_currentPage, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get My Team
  totalMyUsers() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/total-users-count`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  //  Get My Network
  myNetwork(_username) {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/my-team?username=`+_username, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  //  Get My Uni Level Network
  myUniLevelNetwork(_username, page) {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/my-uni-level-team?username=` + _username + '&page=' + page, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Affiliate Token
  getAffiliateToken() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/affiliates`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Pay Affiliate Fees
  payAffiliateFees(_data) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/affiliates/create`, _data, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Affiliate Status
  affiliateStatus() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/affiliates/list`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Sponsor Info
  sponsorInfo(_sponsorId) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/sponsor-info`, _sponsorId)
           .map((response: Response) => response.json())
           .catch(this.handleError);
  }

  // Verify Email Id
  verifyEmail(_token) {
    return this.http.post(`${API_URL}/auth/verify-email`, _token)
           .map((response: Response) => response.json())
           .catch(this.handleError);
  }

  // Send Mail
  sendMail(_sendData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/message/send`, _sendData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Inbox Messages
  inboxMessage(_page) {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/message/inbox?page=`+_page, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Inbox Header Messages
  inboxHeaderMessage(_page) {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/message/inbox?type=1&page=`+_page, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Notification Messages
  notificationHeaderMessage() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/notifications`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Inbox Messages
  markMessageRead(messageObj) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/message/mark-read`, messageObj, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Search Inbox Message
  searchInboxList(_searchData) {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/message/inbox?filter=`+_searchData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Outbox Messages
  outboxMessage(_page) {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/message/sent?page=`+_page, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Search Sent Message
  searchSentList(_searchData) {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/message/sent?filter=`+_searchData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Affiliation Invoice Update
  invoiceUpdate(_hashData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/affiliates/invoice/update`, _hashData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Manage OTP
  manageOTP(_data) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/two-factor`, _data, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Verify 2FA
  verify2FA(_data) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/validate-two-factor`, _data, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Login with OTP
  otpLogin(_data) {
    return this.http.post(`${API_URL}/auth/verify-2fa`, _data)
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Forget Login with OTP
  forgetOTP(_data) {
    return this.http.post(`${API_URL}/auth/forget-2fa`, _data)
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Disable OTP Request
  sendDisableOTP() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/disable-two-factor`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Disable OTP
  disableOTP(_data) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/disable-two-factor`, _data, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Withdrawal Token
  getWithdrawalToken() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/wallet/withdrawal`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Withdrawal Amount
  withdrawal(_withdrawalData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/wallet/withdrawal`, _withdrawalData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Transfer Token
  getTransferToken() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/wallet/transfer`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Transactions
  transactions(_currentPage) {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/wallet/ledger?page=`+_currentPage, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Transactions Withdraw And Transfer
  transactionsWithdrawTransfer(_currentPage) {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/wallet/ledger-withdraw-transfer?page=`+_currentPage, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Admin Modules
  // Post Admin Settings
  adminSettings(_settingData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/admin/settings`, _settingData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Admin Settings
  getSettings() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/admin/settings`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // List Withdrawal By User
  listWithdrawals() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/withdrawal`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // List Withdrawal By User
  listAdminWithdrawals() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/admin/admin-withdrawal`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Withdrawals Admin
  getWithdrawals(_queryObj) {
    let headers = this.headers;
    let queryParam = this.serializeObject(_queryObj);
    return this.http.get(`${API_URL}/api/admin/withdrawal?`+queryParam, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Transfers Admin
  getTransfers(_queryObj) {
    let headers = this.headers;
    let queryParam = this.serializeObject(_queryObj);
    return this.http.get(`${API_URL}/api/admin/transfers?`+queryParam, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Product Purchase List 
  getProductsStatic(_queryObj) {
    let headers = this.headers;
    let queryParam = this.serializeObject(_queryObj);
    return this.http.get(`${TRADING_API_URL}/product/list/static?` + queryParam, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Products Subscription
  getProductsSubscription(_queryObj) {
    let headers = this.headers;
    let queryParam = this.serializeObject(_queryObj);
    return this.http.get(`${TRADING_API_URL}/product/list/subscription?` + queryParam, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Total Products Purchase
  getProductsPurchase() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/products-purchase-total`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Purchase Of Current Month
  getPurchaseCurrentMonth() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/purchase-current-month`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get All Products
  getAllProducts() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/products-list-all`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  purchaseOrder(orderId) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/purchase-order`, {'order_id': orderId}, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  createProducts(productData) {
    let headers = this.headers;
    return this.http.post(`${TRADING_API_URL}/product`, productData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Affiliation Fee Admin
  getCommissionFee(_queryObj) {
    let headers = this.headers;
    let queryParam = this.serializeObject(_queryObj);
    return this.http.get(`${API_URL}/api/admin/fees/commission?`+queryParam, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Withdrawals Fee Admin
  getWithdrawalFee(_queryObj) {
    let headers = this.headers;
    let queryParam = this.serializeObject(_queryObj);
    return this.http.get(`${API_URL}/api/admin/fees/withdrawal?`+queryParam, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Transfer Fee Admin
  getTransferFee(_queryObj) {
    let headers = this.headers;
    let queryParam = this.serializeObject(_queryObj);
    return this.http.get(`${API_URL}/api/admin/fees/transfer?`+queryParam, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Configuration Current Rates Admin
  getConfigCurrentRates() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/admin/current-rates`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Post Configuration Current Rates Admin
  postConfigCurrentRates(_configRates) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/admin/current-rates/create`, _configRates, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Users List By Admin
  getUsersList(_queryObj) {
    let headers = this.headers;
    let queryParam = this.serializeObject(_queryObj);
    return this.http.get(`${API_URL}/api/admin/user-list?`+queryParam, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Users List By Admin
  getOrphanUsersList(_queryObj) {
    let headers = this.headers;
    let queryParam = this.serializeObject(_queryObj);
    return this.http.get(`${API_URL}/api/admin/orphan-user-list?`+queryParam, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Update User By Admin
  updateUser(_userObject) {
    let headers = this.headers;
    return this.http.put(`${API_URL}/api/admin/user/update`, _userObject, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Marked User As Old By Admin
  markUserAsOld(_userObject) {
    let headers = this.headers;
    return this.http.put(`${API_URL}/api/admin/user/marked-user-old`, _userObject, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Block User By Admin
  blockUser(_blockUser) {
    let headers = this.headers;
    return this.http.put(`${API_URL}/api/admin/user/block`, _blockUser, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  getKyc(_queryData) {
    let headers = this.headers;
    let queryParam = this.serializeObject(_queryData);
    return this.http.get(`${API_URL}/api/admin/get-kyc-records?` + queryParam, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  updateKYC(updateData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/admin/update-kyc`, updateData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  getPayments(_queryObj) {
    let headers = this.headers;
    let queryParam = this.serializeObject(_queryObj);
    return this.http.get(`${API_URL}/api/admin/admin-payments?` + queryParam, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  updatePayments(orderData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/admin/update-payments`, orderData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  searchUser(username) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/admin/user-search`, {"search": username}, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  setRole(roleData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/admin/user-roles`, roleData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  createCoins(coinsData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/admin/coins/create`, coinsData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  createCurrency(currencyData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/admin/currency/create`, currencyData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Campaign Reports
  countryWiseUsers() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/admin/country-users`, {headers})
           .map((response: Response) => response.json())
           .catch(this.handleError);
  }

  listCommission(page) {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/admin/commission/list?page=` + page, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  createCommission(commissionData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/admin/commission/create`, commissionData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  updateCommission(commissionData) {
    let headers = this.headers;
    return this.http.put(`${API_URL}/api/admin/commission/update`, commissionData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  updateWithdrawApprovedReject(withdrawData) {
    let headers = this.headers;
    return this.http.put(`${API_URL}/api/admin/withdrawal/status/update`, withdrawData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  listNotifications() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/admin/notification`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  listCMSContent(currentPage) {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/admin/cms/list?page=` + currentPage, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  listUserCMSContent() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/cms`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  createCMSContent(cmsContent) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/admin/cms/content`, cmsContent, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  updateCMSContent(cmsContent) {
    let headers = this.headers;
    return this.http.put(`${API_URL}/api/admin/cms/update/content`, cmsContent, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  deActivatedCMSContent(cmsContent) {
    let headers = this.headers;
    return this.http.put(`${API_URL}/api/admin/cms/de-activate/content`, cmsContent, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  deleteCMSContent(cmsContent) {
    let headers = this.headers;
    let options = new RequestOptions ({
      headers: headers,
      body: cmsContent
    });

    return this.http.delete(`${API_URL}/api/admin/cms/delete/content`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  createKyc(kycData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user/kyc-create`, kycData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  kycDetailsUpdate(kycData) {
    let headers = this.headers;
    return this.http.put(`${API_URL}/api/user/update-kyc`, kycData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  getKycDetails() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/kyc`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  getBroadCastMessage(page) {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/admin/list-broadcast-notification?page=` + page, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  createBroadCastMessage(messageData) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/admin/broadcast-notification`, messageData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  notificationCounts() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/admin/notification-counts`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  updateBroadCastMessage(messageData) {
    let headers = this.headers;
    return this.http.put(`${API_URL}/api/admin/update-broadcast`, messageData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Trasnfer Amount
  transferUserVerify(transferUserVerify) {
    let headers = this.headers;
    return this.http.post(`${API_URL}/api/user-verify`, transferUserVerify, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // My Affiliates
  myAffiliates() {
    let headers = this.headers;
    return this.http.get(`${API_URL}/api/user/my-affiliates`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  /**
   * 
   * Traders API Calling Started
   */

  // Get Companies 
  getCompanies() {
    let headers = this.headers;
    return this.http.get(`${TRADING_API_URL}/company`, {headers})
           .map((response: Response) => response.json())
           .catch(this.handleError);
  }

  getCompany(companyCode) {
    let headers = this.headers;
    return this.http.get(`${TRADING_API_URL}/company/` + companyCode, {headers})
           .map((response: Response) => response.json())
           .catch(this.handleError);
  }

  getCurrency() {
    let headers = this.headers;
    return this.http.get(`${TRADING_API_URL}/currency/list`, {headers})
           .map((response: Response) => response.json())
           .catch(this.handleError);
  }

  // Get Shares
  getShares() {
    let headers = this.headers;
    return this.http.get(`${TRADING_API_URL}/trader/portfolio`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  getCompanyShares(companyCode) {
    let headers = this.headers;
    return this.http.get(`${TRADING_API_URL}/trader/portfolio/` + companyCode, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Shares
  getBKNsWallet() {
    let headers = this.headers;
    return this.http.get(`${TRADING_API_URL}/trader/wallet`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  getOffers(pageNumber, companyCode, type) {
    let headers = this.headers;
    return this.http.get(`${TRADING_API_URL}/offers/company/` + companyCode + `/` + type + `?page=` + pageNumber, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  getOffer(pageNumber) {
    let headers = this.headers;
    return this.http.get(`${TRADING_API_URL}/offers/?page=` + pageNumber, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  getLedgerShares(companyCode, pageNumber) {
    let headers = this.headers;
    return this.http.get(`${TRADING_API_URL}/trader/ledger/portfolio?page=` + pageNumber + '&companyCode=' + companyCode, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  getLedgerWallet(currencyCode, pageNumber) {
    let headers = this.headers;
    return this.http.get(`${TRADING_API_URL}/trader/ledger/wallet?page=` + pageNumber + '&currencyCode=' + currencyCode, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  getLedgerWallets(pageNumber) {
    let headers = this.headers;
    return this.http.get(`${TRADING_API_URL}/trader/ledger/wallet?page=` + pageNumber, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  sellTradePost(postData) {
    let headers = this.headers;
    return this.http.post(`${TRADING_API_URL}/trader/sell-offer`, postData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  bidTradePost(postData) {
    let headers = this.headers;
    return this.http.post(`${TRADING_API_URL}/trader/bid-offer`, postData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  stockPriceGraph(companyCode) {
    let headers = this.headers;
    return this.http.get(`${TRADING_API_URL}/offers/closed?companyCode=` + companyCode, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  stockPriceGraphExchangeData(companyCode) {
    let headers = this.headers;
    return this.http.get(`${TRADING_API_URL}/report/exchange/coin/recent?companyCode=` + companyCode, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  stockPriceGraphExchangeDataCustom(companyCode, filterWord) {
    let headers = this.headers;
    let data = '?companyCode=' + companyCode + '&filterKeyword=' + filterWord;
    return this.http.get(`${TRADING_API_URL}/report/exchange/coin/custom` + data, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  stockPriceGraphCompanyWise(companyCode) {
    let headers = this.headers;
    return this.http.get(`${TRADING_API_URL}/offers/company/` + companyCode + `/closed`, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  sellAcceptTradePost(postData) {
    let headers = this.headers;
    return this.http.post(`${TRADING_API_URL}/trader/sell-accept`, postData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  bidAcceptTradePost(postData) {
    let headers = this.headers;
    return this.http.post(`${TRADING_API_URL}/trader/bid-accept`, postData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Get Products Admin
  getProducts(_queryObj) {
    let headers = this.headers;
    let queryParam = this.serializeObject(_queryObj);
    return this.http.get(`${TRADING_API_URL}/product/list/?` + queryParam, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  getUserStaticProducts(_queryObj) {
    let headers = this.headers;
    let queryParam = this.serializeObject(_queryObj);
    return this.http.get(`${TRADING_API_URL}/product/list/static?` + queryParam, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  getUserSubscriptionProducts(_queryObj) {
    let headers = this.headers;
    let queryParam = this.serializeObject(_queryObj);
    return this.http.get(`${TRADING_API_URL}/product/list/subscription?` + queryParam, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  // Trasnfer Amount
  transferAmount(_transferData) {
    let headers = this.headers;
    return this.http.post(`${TRADING_API_URL}/trader/coin-transfer`, _transferData, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }


  /* Trader Admin Side API Calling */

  getCompanyListAll(page) {
    let headers = this.headers;
    return this.http.get(`${TRADING_API_URL}/company-all?page=` + page, {headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  postCompany(companyData) {
    let headers = this.headers;
    return this.http.post(`${TRADING_API_URL}/company`, companyData, {headers})
    .map((response: Response) => response.json())
    .catch(this.handleError);
  }

  putCompany(companyCode, companyData) {
    let headers = this.headers;
    return this.http.put(`${TRADING_API_URL}/company/` + companyCode, companyData, {headers})
    .map((response: Response) => response.json())
    .catch(this.handleError);
  }

  putEnableCompany(companyCode) {
    let headers = this.headers;
    return this.http.put(`${TRADING_API_URL}/company/enable/` + companyCode, {}, {headers})
    .map((response: Response) => response.json())
    .catch(this.handleError);
  }

  deleteCompany(companyCode) {
    let headers = this.headers;
    let options = new RequestOptions ({
      headers: headers,
      body: null
    });

    return this.http.delete(`${TRADING_API_URL}/company/` + companyCode, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
  }

  transferManuallyShares(transferData) {
    let headers = this.headers;
    return this.http.post(`${TRADING_API_URL}/system/manual-portfolio-allotment`, transferData, {headers})
    .map((response: Response) => response.json())
    .catch(this.handleError);
  }

  transferWalletManually(transferWalletData) {
    let headers = this.headers;
    return this.http.post(`${TRADING_API_URL}/system/manual-wallet-allotment`, transferWalletData, {headers})
    .map((response: Response) => response.json())
    .catch(this.handleError);
  }


  // Global Error Handler
  private handleError(error: Response) {
    var responseError = error.json();
    if (responseError.message === 'Invalid Token') {
      if (ErrorScope.localStorage.retrieve('token')) {
        ErrorScope.localStorage.clear('token');
      }
      ErrorScope._windows.nativeWindow.location.href = '#/login';
    }
    let details = {detail: error.json(), status: error.status};
    return Observable.throw(details);
  }

}
