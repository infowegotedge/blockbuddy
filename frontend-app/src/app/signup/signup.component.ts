import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
// import { CookieService, CookieOptions } from 'angular2-cookie/core';
import { CookieService } from 'ngx-cookie';
import { BBService } from '../bb.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Constants } from '../app.constants';
import { JQueryWork } from '../app.jquery';
import * as moment from 'moment';
import { WindowRef } from '../app.windows';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from "angular4-social-login";
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [
    BBService, 
    // { provide: CookieOptions, useValue: {} }
  ]
})
export class SignupComponent implements OnInit {

  isError: boolean = false;
  serverError: string = '';
  isConfirmPassError: boolean = false;
  userId: string;
  campaignId: string;
  bannerId: string;
  sponsorName: string;
  sponsorId: string;
  passwordPattern: string;
  emailPattern: string;
  countries: any = [];
  otpError: string;
  showOtpBox: boolean;
  auth: any = {};
  forgetOtpError: string;
  forgetOtpSuccess: string;
  userNamePattern: string;
  namePattern: string;
  forceMe: Boolean;
  private userObj: SocialUser;

  form: FormGroup;
  username: FormControl;
  firstName: FormControl;
  lastName: FormControl;
  email: FormControl;
  mobile: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  country: FormControl;

  @ViewChild('sponsorModal') public sponsorModal: ModalDirective;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bbService: BBService,
    private _cookieService: CookieService,
    private localStorage: LocalStorageService,
    private _exWork: JQueryWork,
    private _windows: WindowRef,
    private authService: AuthService
  ) {
    let param = this.route.snapshot.queryParams["ref"];
    // this.campaignId = this.route.snapshot.queryParams["campaignid"];
    // this.bannerId = this.route.snapshot.queryParams["bannerid"];
    // Check for ID param
    if (param) {
      // localStorage.setItem('sponsorId', param);
      localStorage.store('sponsorId', param);
    } else {
      // localStorage.setItem('sponsorId', 'bb');
      localStorage.store('sponsorId', 'bbcorp');
    }
    this.passwordPattern = Constants.PASSWORD_PATTER;
    this.emailPattern    = Constants.EMAIL_PATTER;
    this.userNamePattern = Constants.USERNAME_PATTER;
    this.namePattern     = Constants.NAME_PATTER;
  }

  countryInfo() {
    this.bbService.getCountryInfo()
    .subscribe(_res => {
      this.countries = _res;
    })
  }

  // validatePassword(pass, confirmPass) {
  validatePassword() {
    let that = this;
    setTimeout(function() {
      let pass = that.form.value.password;
      let confirmPass = that.form.value.confirmPassword;

      if (pass === confirmPass) {
        that.isConfirmPassError = false;
      } else {
        that.isConfirmPassError = true;
      }
      return that.isConfirmPassError;
    }, 50);
  }

  validatePasswordControl() {
    let pass = this.form.value.password;
    let confirmPass = this.form.value.confirmPassword;

    if (pass === confirmPass) {
      this.isConfirmPassError = false;
    } else {
      this.isConfirmPassError = true;
    }
    return this.isConfirmPassError;
  }

  countVisitAffiliates(sponsorId) {
    let visitData = {
      username: sponsorId
    }

    this.bbService.visitAffiliates(visitData)
    .subscribe((_res) => {
      // console.log(_res);
    })
  }

  getSponsorInfo(sponsor) {
    let sponsorId = {
      'sponsor': (sponsor ? sponsor : this.localStorage.retrieve('sponsorId'))
    }

    this.bbService.sponsorInfo(sponsorId)
    .subscribe((_res) => {
      if (!_res.hasError) {
        this.sponsorName = _res.sponsor.name;
        if (sponsor) {
          this.sponsorId = sponsor;
        }
      }
    })
  }

  sponsorFind(event) {
    this.getSponsorInfo(event.target.value);
  }

  closeSponsorPopup() {
    this.forceMe = true;
    this.hideModal();
  }

  register() {
    let userData: any = {};
    userData = {
      sponsorid: this.sponsorId,
      username: this.form.value.username,
      password: this.form.value.password,
      email: this.form.value.email,
      fname: this.form.value.firstName,
      lname: this.form.value.lastName,
      country: this.form.value.country,
      mobile: JSON.stringify(this.form.value.mobile)
    }

    if (this.campaignId) {
      userData.campaignid = this.campaignId;
    }

    if (this.bannerId) {
      userData.bannerid = this.bannerId;
    }

    if (this.sponsorId === 'bbcorp' && this.forceMe !== true) {
      this.showSponsorModal();
      return false;
    }

    this.isConfirmPassError = this.validatePasswordControl();

    this.isError = false;
    if(/^((0*)|(9*)|(0123456789))$/.test(this.form.value.mobile)) {
      this.isError = true;
      this.serverError = 'Phone number is not valid, Please enter your valid phone number';
    }

    if (!this.isConfirmPassError && !this.isError) {
      this.bbService.register(userData)
      .subscribe((res) => {
        if (res.hasError === true) {
          this.isError = true;
          this.serverError = res.message;
        } else {
          this._cookieService.put('signup', '1', {expires: moment().second(300).toISOString()});
          this.router.navigate(['/success']);
        }
      })
    } else {
      return this.isConfirmPassError;
    }
  }

  createFormControls() {
    this.username = new FormControl('', [
      Validators.required,
      Validators.pattern(this.userNamePattern)
    ]);
    this.firstName = new FormControl('', [
      Validators.required,
      Validators.pattern(this.namePattern)
    ]);
    this.lastName = new FormControl('', [
      Validators.required,
      Validators.pattern(this.namePattern)
    ]);
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern(this.emailPattern)
    ]);
    this.mobile = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15)
    ]);
    this.country = new FormControl('', [
      Validators.required
    ]);
    this.confirmPassword = new FormControl('', [
      Validators.required
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.pattern(this.passwordPattern),
      Validators.minLength(6)
    ]);
  }

  createForm() {
    this.form = new FormGroup({
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      mobile: this.mobile,
      country: this.country,
      confirmPassword: this.confirmPassword,
      password: this.password
    });
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

  storeAndRedirect(_resData) {
    this.localStorage.store('token', _resData.token);
    this.localStorage.store('refreshPage', '1');
    this.localStorage.store('role', _resData.role);
    this._cookieService.put('token', _resData.token, {expires: moment().second(_resData.exipresIn).toISOString()});
    this._windows.nativeWindow.location.href = '#/dashboard';
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

  showSponsorModal() {
    this.sponsorModal.show();
  }

  public hideModal(): void {
    this.sponsorModal.hide();
  }

  hideOTPForm() {
    this.showOtpBox = false;
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    if (this._exWork) {
      let hideElement = this._exWork.hideDOMElement;
    }

    this.sponsorId = this.localStorage.retrieve('sponsorId');
    this.countVisitAffiliates(this.sponsorId);

    this.countryInfo();
    this.getSponsorInfo(null);
  }

}
