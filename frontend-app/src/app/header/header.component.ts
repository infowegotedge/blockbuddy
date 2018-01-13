import { Component, OnInit } from '@angular/core';
// import { CookieService, CookieOptions } from 'angular2-cookie/core';
import { CookieService } from 'ngx-cookie';
import { BBService } from '../bb.service';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { WindowRef } from '../app.windows';
import { AuthService } from "angular4-social-login"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  // providers: [
  //   // { provide: CookieOptions, useValue: {} }
  // ]
})
export class HeaderComponent implements OnInit {

  private isClass = false;
  private user: any = {};
  public adminRole: boolean;
  countryFlag: string;
  countryName: string;
  flagUrl: string;
  // products: any = [];
  companies: any = [];
  inboxMessage: any = [];
  totalUnread: number;
  notificationMessage: any = [];
  totalUnreadNotification: number;
  traderWallet: any = [];
  companiesShares: any = [];
  message: any = [];
  hasOne: boolean = false;
  hasRow: boolean = false;
  hideBroadCastMessage: boolean = false;
  messageKey: string;

  constructor(
    private _cookieService: CookieService,
    private bbService: BBService,
    private localStorage: LocalStorageService,
    private _windows: WindowRef,
    private authService: AuthService
  ) { }

  logout() {
    if (this.localStorage.retrieve('exto')) {

      this.localStorage.clear('exto');
      this.localStorage.clear('xrole');
      this.localStorage.clear('xtrade');

    } else {
      this.authService.signOut();
      this.localStorage.clear('token');
      this.localStorage.clear('trade');
      this.localStorage.clear('userid');
      this.localStorage.clear('role');
      this.localStorage.clear('my-statistic');
      this.localStorage.clear('timestamp');
      this.localStorage.clear('updateProfile');
    }

    this._windows.nativeWindow.location.href = '#/login';
    this._windows.nativeWindow.location.reload();
  }

  getProfile() {
   this.bbService.getProfile()
    .subscribe((res) => {
      if (res.message === 'Invalid Token') {
        if (this.localStorage.retrieve('token')) {
          this.logout();
        }
      } else {
        this.user = res.user;
        this.localStorage.store('userid', res.user.username);
        this.localStorage.store('updateProfile', res.user.profile_updated);
        this.getCountryFlag();
      }
    })
  }

  getCompanyShares() {
    this.bbService.getShares()
    .subscribe((res) => {
      if(!res.error) {
        this.companiesShares = res.data || [];
      }
    });
  }

  getBKNsWallet() {
    this.bbService.getBKNsWallet()
    .subscribe((res) => {
      if(!res.error) {
        this.traderWallet = res.data || [];
      }
    });
  }

  getCountryFlag() {
    this.bbService.countryFlag()
    .subscribe((_res) => {
      this.countryFlag = _res;
      let countryName = this.user.country;
      if (this.countryFlag[countryName]) {
        this.flagUrl = 'assets/images/flags/' +
        this.countryFlag[countryName].toLowerCase() + '_16.png';
      }
    })
  }

  // Get Inbox Message
  getInboxMessage() {
    this.bbService.inboxHeaderMessage(1)
    .subscribe((res) => {
      if (!res.hasError) {
        this.inboxMessage = res.messages;
        this.totalUnread  = res.totalUnread;
      }
    })
  }

  // Get Inbox Message
  getNotificationsMessage() {
    this.bbService.notificationHeaderMessage()
    .subscribe((res) => {
      if (!res.hasError) {
        this.notificationMessage      = res.notifications;
        this.totalUnreadNotification  = res.totalRows;
      }
    })
  }

  adminNotification() {
    this.bbService.getBroadCastMessage(1)
    .subscribe((res) => {
      if (!res.hasError) {
        let message = res.notification
        this.hasRow = false;
        if(message.length > 0) {
          this.hasRow = true;
          this.hasOne = false;
          if (message.length === 1) {
            this.message = message[0];
            this.hasOne  = true;
            this.messageKey = message[0]._id;
            if (this.localStorage.retrieve(this.messageKey) === '1') {
              this.hideBroadCastMessage = true;
            }
          } else {
            this.message = message;
            this.messageKey = message[0]._id;
            if (this.localStorage.retrieve(this.messageKey) === '1') {
              this.hideBroadCastMessage = true;
            }
          }
        }
      }
    })
  }

  hideMe() {
    this.hideBroadCastMessage = true;
    this.localStorage.store(this.messageKey, '1');
  }

  ngOnInit() {
    let role = this.localStorage.retrieve('role');
    let xrole = this.localStorage.retrieve('xrole');

    if(xrole) {
      role = xrole;
    }

    this.companies = [];
    this.companiesShares = [];
    this.traderWallet = [];
    if (this.localStorage.retrieve('token')) {
      this.getProfile();
      this.getCompanyShares();
      this.getBKNsWallet();
      this.getInboxMessage();
      this.getNotificationsMessage();
      this.adminNotification();
    }

    this.adminRole = false;
    if ( role === 'admin' ) {
      this.adminRole = true;
    }
  }

}
