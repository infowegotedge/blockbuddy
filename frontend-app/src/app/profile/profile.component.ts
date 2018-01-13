import { Component, OnInit, NgZone, Inject, EventEmitter, ViewChild} from '@angular/core';
import { BBService } from '../bb.service';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { LocalStorageService } from 'ngx-webstorage';
import { Constants } from '../app.constants';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any = {};
  wallet: any = {};
  btcAddress: string;
  profileMessage: boolean;
  profileError: boolean;
  walletMessage: boolean;
  noBtcAddress: boolean;
  showLoader: boolean;
  showGovLoader: boolean;
  showTaxLoader: boolean;
  countries: any = [];
  imageData: any = {};
  response: any;
  sizeLimit: number = 1000000; // 1MB
  previewData: any;
  errorMessage: string;
  sponsorInfo: any = {};
  emailPattern: string;
  adminRole: boolean;
  textButton: string;
  form: FormGroup;
  username: FormControl;
  fname: FormControl;
  lname: FormControl;
  postal: FormControl;
  email: FormControl;
  mobile: FormControl;
  country: FormControl;
  state: FormControl;
  city: FormControl;
  address: FormControl;

  addressForm: FormGroup;
  btcaddress: FormControl;

  kycForm: FormGroup;
  govPhotoId: FormControl;
  taxPhotoId: FormControl;
  governmentId: FormControl;
  taxId: FormControl;
  govIPhotoId: String;
  taxIPhotoId: String;
  kycId: String;
  kycSuccess: String;
  kycError: String;
  readonlyTextBoxes: Boolean = false;

  /* Change Password */
  isConfirmPassError: boolean;
  passwordError: boolean;
  passwordSuccess: boolean;
  serverError: boolean;
  passwordPattern: string;
  changePassForm: FormGroup;
  oldpassword: FormControl;
  confirmpassword: FormControl;
  password: FormControl;

  // addressPattern: string;
  // statePattern: string;
  // zipCodePattern: string;
  // cityPattern: string;

  @ViewChild('changePassModal') public changePassModal: ModalDirective;
  @ViewChild('kycImageSuccess') public kycImageSuccess: ModalDirective;
  constructor(private bbService: BBService, private localStorage: LocalStorageService, private _ngZone: NgZone) {
    this.emailPattern = Constants.EMAIL_PATTER;
    this.textButton = 'Upload';
    this.passwordPattern = Constants.PASSWORD_PATTER;
    // this.addressPattern  = Constants.ADDRESS_VALIDATION_PATTERN;
    // this.statePattern    = Constants.STATE_VALIDATION_PATTERN;
    // this.zipCodePattern  = Constants.POSTAL_VALIDATION_PATTERN;
    // this.cityPattern     = Constants.CITY_VALIDATION_PATTERN;
  }

  updateProfile() {
    let userData = {
      fname: (this.form.value.fname || this.user.first_name),
      lname: (this.form.value.lname || this.user.last_name),
      postal: (this.form.value.postal || this.user.postal),
      email: this.form.value.email,
      mobile: (this.form.value.mobile || this.user.mobile),
      country: (this.form.value.country || this.user.country),
      state: (this.form.value.state || this.user.state),
      city: (this.form.value.city || this.user.city),
      address: (this.form.value.address || this.user.address)
    }

    this.bbService.updateProfile(userData)
    .subscribe((res) => {
      if (res.hasError) {
        this.profileError   = res.message;
        this.profileMessage = false;
      } else {
        this.profileError   = null;
        this.profileMessage = true;
        this.readonlyTextBoxes = true;
      }
    })
  }

  countryInfo() {
    this.bbService.getCountryInfo()
    .subscribe(_res => {
      let countries = _res;
      let countryList = [];
      for (let idx = 0; idx < countries.length; idx++) {
        countryList.push({
          code: countries[idx].code,
          dial_code: countries[idx].dial_code,
          name: countries[idx].name,
          actualName: countries[idx].name.toLowerCase()
        });
      }
      this.countries = countryList;
    })
  }

  setWalletMessage() {
    this.walletMessage = false;
  }

  setProfileMessage() {
    this.profileMessage = false;
  }

  updateWallet() {
    let walletData = {
      btcaddress: this.addressForm.value.btcaddress
    }

    // if (localStorage.getItem('btc')) {
    if (this.localStorage.retrieve('btc')) {
      this.bbService.createBtcAddress(walletData)
      .subscribe((res) => {
        if (!res.hasError) {
          this.walletMessage = true;
          this.localStorage.clear('btc');
        }
      })
    } else {
      this.bbService.updateWallet(walletData)
      .subscribe((res) => {
        if (!res.hasError) {
          this.walletMessage = true;
        }
      })
    }
  }

  createKyc() {
    if (this.kycForm.valid) {
      let kycData = {
        "photoId": this.govIPhotoId,
        "taxPhotoId": this.taxIPhotoId,
        "governmentId": this.kycForm.value.governmentId,
        "taxId": this.kycForm.value.taxId
      };

      if(this.kycId === '') {
        this.bbService.createKyc(kycData)
        .subscribe(_res => {
          if(!_res.hasError) {
            this.kycSuccess = _res.message;
            this.kycError   = null;
          } else {
            this.kycSuccess = null;
            this.kycError   = _res.message;
          }
        });
      } else if(this.kycId !== '') {
        kycData["id"] = this.kycId;

        this.bbService.kycDetailsUpdate(kycData)
        .subscribe(_res => {
          if(!_res.hasError) {
            this.kycSuccess = _res.message;
            this.kycError   = null;
          } else {
            this.kycSuccess = null;
            this.kycError   = _res.message;
          }
        });
      }
    }
  }

  getKycDetails() {
    this.bbService.getKycDetails()
    .subscribe(_res => {
      if(!_res.hasError && _res.kyc) {
        this.kycId       = _res.kyc._id;
        this.govIPhotoId = _res.kyc.s3asset.selfie;
        this.taxIPhotoId = _res.kyc.s3asset.id_1;
        this.kycForm.controls['governmentId'].setValue(_res.kyc.user.taxid);
        this.kycForm.controls['taxId'].setValue(_res.kyc.user.govid);
      }
    });
  }

  fileChange(event, eleId) {
    let fileList: FileList = event;
    let fieldName = "file";

    if (eleId === "govPhotoId") {
      this.showGovLoader = true;
      fieldName = "govPhotoId";
    } else if (eleId === "taxPhotoId") {
      this.showTaxLoader = true;
      fieldName = "taxPhotoId";
    } else {
      this.showLoader = true;
    }

    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append(fieldName, file, file.name);
      this.bbService.changeAvatar(formData)
      .subscribe((res) => {
        if (!res.hasError && eleId === "govPhotoId") {
          this.kycForm.controls['govPhotoId'].setValue(res.path);
          this.govIPhotoId = res.path;
          this.kycImageSuccess.show();
        } else if (!res.hasError && eleId === "taxPhotoId") {
          this.kycForm.controls['taxPhotoId'].setValue(res.path);
          this.taxIPhotoId = res.path;
          this.kycImageSuccess.show();
        } else if(!res.hasError) {
          this.user.avatar = res.path;
        }

        this.showLoader    = false;
        this.showTaxLoader = false;
        this.showGovLoader = false;
      })
    }
  }

  getProfile() {
    this.bbService.getProfile()
    .subscribe((res) => {
      this.user = res.user;
      this.form.controls['username'].setValue(this.user.username);
      this.form.controls['fname'].setValue(this.user.first_name);
      this.form.controls['lname'].setValue(this.user.last_name);
      this.form.controls['email'].setValue(this.user.email);
      this.form.controls['mobile'].setValue(this.user.mobile);
      this.form.controls['address'].setValue(this.user.address);
      if (this.user.country.length === 2) {
        this.countries.forEach(element => {
          if (element.code.toLowerCase() === this.user.country.toLowerCase()) {
            this.form.controls['country'].setValue(element.actualName);
          }
        });
      } else {
        this.form.controls['country'].setValue(this.user.country.toLowerCase());
      }
      this.form.controls['state'].setValue(this.user.state);
      this.form.controls['city'].setValue(this.user.city);
      this.form.controls['postal'].setValue(this.user.postal);
      this.readonlyTextBoxes = (this.user.profile_updated || false);
    })
  }

  getBtcAddress() {
    this.bbService.btcAddress()
    .subscribe((res) => {
      this.btcAddress = res.btcAddress;
      this.addressForm.controls['btcaddress'].setValue(this.btcAddress);
      if (res.btcAddress === "") {
        // localStorage.setItem('btc', '1');
        this.localStorage.store('btc', '1');
      }
    })
  }

  showChangePass() {
    this.changePassModal.show();
  }

  hideChangePass() {
    this.changePassModal.hide();
  }

  /* Change Password */
  validatePassword(pass, confirmPass) {
    if (pass === confirmPass) {
      this.isConfirmPassError = false;
    } else {
      this.isConfirmPassError = true;
    }
    return this.isConfirmPassError;
  }

  changePassword() {
    let data = {
      oldpassword : this.changePassForm.value.oldpassword,
      password: this.changePassForm.value.password,
      confirmpassword: this.changePassForm.value.confirmpassword
    }

    this.isConfirmPassError = this.validatePassword(data.password, data.confirmpassword);

    if (!this.isConfirmPassError) {
      this.bbService.changePassword(data)
      .subscribe((res) => {
        if (res.hasError) {
          this.passwordSuccess = false;
          this.passwordError = true;
          this.serverError = res.message;
        } else {
          this.passwordError = false;
          this.passwordSuccess = true;
        }

        this._ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this._ngZone.run(() => {
              if (this.passwordError === true) {
                this.passwordError = false;
              } else if (this.passwordSuccess === true) {
                this.passwordSuccess = false;
              }
              this.hideChangePass();
            });
          }, 3000);
        });
      });
    }
  }
  /* End Change Password */

  createFormControls() {
    this.username = new FormControl('', [
      Validators.required
    ]);
    this.fname = new FormControl('', [
      Validators.required
    ]);
    this.lname = new FormControl('', [
      Validators.required
    ]);
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern(this.emailPattern)
    ]);
    this.mobile = new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]);
    this.address = new FormControl(null, [
      Validators.required
    ]);
    this.country = new FormControl(null);
    this.state = new FormControl(null, [
      Validators.required
    ]);
    this.city = new FormControl(null, [
      Validators.required
    ]);
    this.postal = new FormControl(null, [
      Validators.required
    ]);

    this.btcaddress = new FormControl('', [
      Validators.required
    ]);

    this.govPhotoId = new FormControl('', [
      Validators.required
    ])
    this.taxPhotoId = new FormControl('', [
      Validators.required
    ]);
    this.governmentId = new FormControl('', [
      Validators.required
    ]);
    this.taxId = new FormControl('', [
      Validators.required
    ]);

    /* Change Password */
    this.confirmpassword = new FormControl('', [
      Validators.required
    ]);

    this.password = new FormControl('', [
      Validators.required,
      Validators.pattern(this.passwordPattern),
      Validators.minLength(6)
    ]);

    this.oldpassword = new FormControl('', [
      Validators.required,
      Validators.pattern(this.passwordPattern),
      Validators.minLength(6)
    ]);
  }

  createForm() {
    this.form = new FormGroup({
      username: this.username,
      fname: this.fname,
      lname: this.lname,
      postal: this.postal,
      email: this.email,
      mobile: this.mobile,
      country: this.country,
      state: this.state,
      city: this.city,
      address: this.address
    });

    this.addressForm = new FormGroup({
      btcaddress: this.btcaddress
    });

    this.kycForm = new FormGroup({
      govPhotoId: this.govPhotoId,
      taxPhotoId: this.taxPhotoId,
      governmentId: this.governmentId,
      taxId: this.taxId,
    });

    /* Change Password */
    this.changePassForm = new FormGroup({
      oldpassword: this.oldpassword,
      confirmpassword: this.confirmpassword,
      password: this.password
    });
  }

  ngOnInit() {
    this.countryInfo();
    this.createFormControls();
    this.createForm();

    this.showLoader    = false;
    this.showGovLoader = false;
    this.govIPhotoId   = '';
    this.showTaxLoader = false;
    this.taxIPhotoId   = '';
    this.kycId         = '';
    this.getProfile();
    this.getBtcAddress();
    this.getKycDetails();

    let role = this.localStorage.retrieve('role');

    if (role === 'admin' || role === 'moderator' || role === 'supervisor') {
      this.adminRole = true;
    } else {
      this.adminRole = false;
    }
  }

}
