import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BBService } from '../bb.service';

@Component({
  selector: 'app-otp-feature',
  templateUrl: './otp-feature.component.html',
  styleUrls: ['./otp-feature.component.css']
})
export class OtpFeatureComponent implements OnInit {
  myForm: FormGroup;

  private user: any= {};
  private serverError: boolean;
  auth: any = {};
  countries: any = [];
  hideCountry: boolean = true;
  showQrCode: boolean = false;
  otpSuccess: string;
  otpError: string;
  otpStatus: boolean;
  disableSection: boolean = false;
  displayAuthSection: boolean = false;
  form: FormGroup;
  vform: FormGroup;
  token: FormControl;

  constructor(private bbService: BBService) { }

  manageOtp(_auth) {
    let otpData;
    otpData = {
      verifyBy : _auth.type.toUpperCase(),
      countryCode: this.user.newPassword,
      mboileNumber: this.user.confirmPassword
    }

   this.bbService.manageOTP(otpData)
    .subscribe((res) => {
      if (!res.hasError) {
        this.showQrCode = true;
        this.displayAuthSection = false;
        this.auth.authKey = res.twoFactor.key;
        this.auth.qrCode = res.twoFactor.qrCode;
        this.auth.type = _auth.type;
      }
    });
  }

  countryInfo() {
    this.bbService.getCountryInfo()
    .subscribe(_res => {
      this.countries = _res;
    })
  }

  getAuthType(_type) {
    if (_type === 'google') {
      this.hideCountry = false;
    } else {
      this.hideCountry = true;
    }
  }

  verifyOtp() {
    let verifyData = {
      key : this.auth.authKey,
      token : this.form.value.token,
      verifyBy : this.auth.type.toUpperCase()
    }

    this.bbService.verify2FA(verifyData)
    .subscribe((res) => {
      if (!res.hasError) {
        this.showQrCode = false;
        this.auth = {};
        this.otpSuccess = res.message;
        this.getOTPStatus();
      } else {
        this.otpError = res.message;
      }
    })
  }

  getOTPStatus() {
   this.bbService.getProfile()
    .subscribe((res) => {
      this.otpStatus = res.user.enable2FA;
    })
  }

  changeOTPStatus(_otpStatus) {
    if (_otpStatus === true) {
      this.bbService.sendDisableOTP()
      .subscribe((res) => {
        this.disableSection =  true;
      })
    } else {
      this.displayAuthSection = true;
      this.manageOtp({type: 'google'})
    }
  }

  disableOTP(_auth) {
    let disableData = {
      token: this.form.value.token
    }

    this.bbService.disableOTP(disableData)
    .subscribe((res) => {
      if (res.hasError) {
        this.otpError = res.message;
      } else {
        this.getOTPStatus();
        this.otpSuccess = res.message;
        this.disableSection =  false;
      }
    });
  }

  createFormControls() {
    this.token = new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]);
  }

  createForm() {
    this.form = new FormGroup({
      token: this.token
    });
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.countryInfo();
    this.getOTPStatus();
    this.auth.countryCode = '';
    // this.auth.type = 'authy';
    this.auth.type = 'google';
  }

}
