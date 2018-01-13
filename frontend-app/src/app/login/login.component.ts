import { Component, OnInit } from '@angular/core';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { LocalStorageService } from 'ngx-webstorage';
import { WindowRef } from '../app.windows';
import { JQueryWork } from '../app.jquery';
// import { CookieService, CookieOptions } from 'angular2-cookie/core';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';
import { BBService } from '../bb.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from "angular4-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    BBService,
    // { provide: CookieOptions, useValue: {} }
  ]
})

export class LoginComponent implements OnInit {

  user: any = {};
  loading = false;
  private isError = false;
  private serverError = '';
  private userObj: SocialUser;
  private loggedIn: boolean;
  otpError: string;
  showOtpBox: boolean;
  auth: any = {};
  forgetOtpError: string;
  forgetOtpSuccess: string;
  form: FormGroup;
  username: FormControl;
  password: FormControl;

  constructor(
    private bbService: BBService,
    private _cookieService: CookieService,
    private router: Router,
    private localStorage: LocalStorageService,
    private _windows: WindowRef,
    private _exWork: JQueryWork,
    private authService: AuthService
  ) { }

  login() {
    this.user = {
      username: this.form.value.username,
      password: this.form.value.password
    };

    this.serverError = '';
    this.loading = true;
    this.bbService.login(this.user.username, this.user.password)
    .subscribe(res => {
      if (res.hasError) {
        this.isError = true;
        this.serverError = res.message;
      } else {
        if (res.token) {
          this.storeAndRedirect(res);
        } else {
          this.auth.authType = res.code;
          this.auth.authKey = res.key;
          this.auth.tokenKey = res.token_key;
          this.showOtpBox = true;
        }
      }
    });
  }

  verifyOtpLogin() {
    let verifyData = {
      key: this.auth.authKey,
      token_key: this.auth.tokenKey,
      token: this.auth.authCode,
      verifyBy: this.auth.authType
    }
    this.bbService.otpLogin(verifyData)
    .subscribe((res) => {
      if (!res.hasError) {
        this.storeAndRedirect(res);
      } else {
        this.serverError = res.message;
      }
    })
  }

  hideOTPForm() {
    this.showOtpBox = false;
  }

  storeAndRedirect(_resData) {
    this.localStorage.store('token', _resData.token);
    this.localStorage.store('trade', _resData.tokenValue);
    this.localStorage.store('refreshPage', '1');
    this.localStorage.store('role', _resData.role);
    this.localStorage.store('timestamp', moment().second(_resData.exipresIn).toISOString());
    this._cookieService.put('token', _resData.token, {expires: moment().second(_resData.exipresIn).toISOString()});
    // this._windows.nativeWindow.location.href = '#/dashboard';
    this._windows.nativeWindow.location.href = '/';
  }

  loggedInUser() {
    if (this.localStorage.retrieve('token')) {
      // this.localStorage.store('refreshPage', '1');
      // this._windows.nativeWindow.location.href = '/';
      this.router.navigate(['/dashboard']);
    }
  }

  doForget2FA() {
    let verifyData = {
      key: this.auth.authKey,
      token_key: this.auth.tokenKey,
      verifyBy: this.auth.authType
    }

    this.bbService.forgetOTP(verifyData)
    .subscribe((res) => {
      if (!res.hasError) {
        this.forgetOtpError = null;
        this.forgetOtpSuccess = res.message;
      } else {
        this.forgetOtpError = res.message;
        this.forgetOtpSuccess = null;
      }
    })
  }

  signInWithGoogle(): void {
    this.bbService.getAuthService().signIn(GoogleLoginProvider.PROVIDER_ID)
    .then((user) => {
      this.loginUserOnSignInUser(user);
    });
  }

  signInWithFB(): void {
    this.bbService.getAuthService().signIn(FacebookLoginProvider.PROVIDER_ID)
    .then((user) => {
      this.loginUserOnSignInUser(user);
    });
  }

  loginUserOnSignInUser(user) {
    if (user != null) {
      let sponsorId = this.localStorage.retrieve('sponsorId');
      if (!sponsorId) {
        sponsorId = 'bbcorp';
      }

      let userObj = {
        "sponsorid": sponsorId,
        "name": user.name,
        "id": user.id,
        "image": user.photoUrl,
        "email": user.email,
        "provider": user.provider
      };

      this.bbService.loginOrRegister(userObj)
      .subscribe((_res) => {
        if (!_res.hasError) {
          if (_res.token) {
            this.storeAndRedirect(_res);
          } else {
            this.auth.authType = _res.code;
            this.auth.authKey  = _res.key;
            this.auth.tokenKey = _res.token_key;
            this.showOtpBox = true;
          }
        } else {
          this.isError = true;
          this.serverError = _res.message;
        }
      });
    }
  }

  createFormControls() {
    this.username = new FormControl('', [
      Validators.required
    ]);

    this.password = new FormControl('', [
      Validators.required
    ]);
  }

  createForm() {
    this.form = new FormGroup({
      username: this.username,
      password: this.password
    });
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    if (this._exWork) {
      let hideElement = this._exWork.hideDOMElement;
    }

    this.loggedInUser();
  }

}
