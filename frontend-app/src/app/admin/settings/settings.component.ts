import { Component, OnInit } from '@angular/core';
import { BBService } from '../../bb.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Constants } from '../../app.constants';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  setting:any = {};
  successMessage:string;
  errorMessage:string;
  numberPattern: string;
  form: FormGroup;
  cutOffValue: FormControl;
  affiliationFee: FormControl;
  affiliationAmount: FormControl;
  withdrawalFee: FormControl;
  transferFee: FormControl;
  withdrawalAutoLimit: FormControl;
  withdrawalMinLimit: FormControl;
  withdrawalMaxLimit: FormControl;
  transferPerUserDayLimit: FormControl;
  transferCoinPerUserDayLimit: FormControl;
  mailChimpKey: FormControl;
  mailChimpList: FormControl;
  mailChimpEmail: FormControl;
  mailChimpFromName: FormControl;
  enableDisableButton: Boolean;

  coinForm: FormGroup;
  coinName: FormControl;
  coinCurrency: FormControl;
  coinValue: FormControl;
  coinSuccess: String;
  coinError: String;

  currencyForm: FormGroup;
  currency: FormControl;
  currencyCode: FormControl;
  currencySuccess: String;
  currencyError: String;

  constructor(private bbService:BBService) {
    this.numberPattern = Constants.NUMBER_PATTER;
  }

  updateSettings() {
    let settingData = {
      cutOffValue: this.form.value.cutOffValue,
      affiliationFee: this.form.value.affiliationFee,
      affiliationAmount: this.form.value.affiliationAmount,
      withdrawalFee: this.form.value.withdrawalFee,
      transferFee: this.form.value.transferFee,
      withdrawalAutoLimit: this.form.value.withdrawalAutoLimit,
      withdrawalMinLimit: this.form.value.withdrawalMinLimit,
      withdrawalMaxLimit: this.form.value.withdrawalMaxLimit,
      transferPerUserDayLimit: this.form.value.transferPerUserDayLimit,
      transferCoinPerUserDayLimit: this.form.value.transferCoinPerUserDayLimit,
      mailChimpKey: this.form.value.mailChimpKey,
      mailChimpList: this.form.value.mailChimpList,
      mailChimpEmail: this.form.value.mailChimpEmail,
      mailChimpFromName: this.form.value.mailChimpFromName
    }

    this.bbService.adminSettings(settingData)
    .subscribe((res) => {
      if (!res.hasError) {
        this.successMessage = res.message;
        this.errorMessage = null;
      } else {
        this.errorMessage = res.message;
        this.successMessage = null;
      }
    })
  }

  getSettings() {
    this.bbService.getSettings()
    .subscribe((res) => {
      this.setting = res.settings;
      this.form.controls['cutOffValue'].setValue(this.setting.cutOffValue);
      this.form.controls['affiliationFee'].setValue(this.setting.affiliationFee);
      this.form.controls['affiliationAmount'].setValue(this.setting.affiliationAmount);
      this.form.controls['withdrawalFee'].setValue(this.setting.withdrawalFee);
      this.form.controls['withdrawalAutoLimit'].setValue(this.setting.withdrawalAutoLimit);
      this.form.controls['withdrawalMinLimit'].setValue(this.setting.withdrawalMinLimit);
      this.form.controls['withdrawalMaxLimit'].setValue(this.setting.withdrawalMaxLimit);
      this.form.controls['transferFee'].setValue(this.setting.transferFee);
      this.form.controls['transferPerUserDayLimit'].setValue(this.setting.transferPerUserDayLimit);
      this.form.controls['transferCoinPerUserDayLimit'].setValue(this.setting.transferCoinPerUserDayLimit);
      this.form.controls['mailChimpKey'].setValue(this.setting.mailChimpKey);
      this.form.controls['mailChimpList'].setValue(this.setting.mailChimpList);
      this.form.controls['mailChimpEmail'].setValue(this.setting.mailChimpEmail);
      this.form.controls['mailChimpFromName'].setValue(this.setting.mailChimpFromName);
      this.enableDisableButton = (!res.settings.enableDisable);
    })
  }

  createCurrency() {
    if (this.currencyForm.valid) {
      let currencyData = {
        currency: this.currencyForm.value.currency,
        code: this.currencyForm.value.currencyCode
      }
      
      this.bbService.createCurrency(currencyData)
      .subscribe((res) => {
        if (!res.hasError) {
          this.currencySuccess = res.message;
          this.currencyError = null;
        } else {
          this.currencyError = res.message;
          this.currencySuccess = null;
        }
      });
    }
  }

  createCoins() {
    if (this.coinForm.valid) {
      let coinsData = {
        coinName: this.coinForm.value.coinName,
        coinCode: this.coinForm.value.coinCurrency,
        coinValue: this.coinForm.value.coinValue
      }

      this.bbService.createCoins(coinsData)
      .subscribe((res) => {
        if (!res.hasError) {
          this.coinSuccess = res.message;
          this.coinError = null;
        } else {
          this.coinError = res.message;
          this.coinSuccess = null;
        }
      });
    }
  }

  createFormControls() {
    this.cutOffValue = new FormControl(0, Validators.pattern(this.numberPattern));
    this.affiliationFee = new FormControl(0, Validators.pattern(this.numberPattern));
    this.affiliationAmount = new FormControl(0, Validators.pattern(this.numberPattern));
    this.withdrawalFee = new FormControl(0, Validators.pattern(this.numberPattern));
    this.transferFee = new FormControl(0, Validators.pattern(this.numberPattern));
    this.withdrawalAutoLimit = new FormControl(0, Validators.pattern(this.numberPattern));
    this.withdrawalMinLimit = new FormControl(0, Validators.pattern(this.numberPattern));
    this.withdrawalMaxLimit = new FormControl(0, Validators.pattern(this.numberPattern));
    this.transferPerUserDayLimit = new FormControl(0, Validators.pattern(this.numberPattern));
    this.transferCoinPerUserDayLimit = new FormControl(0, Validators.pattern(this.numberPattern));
    this.mailChimpKey = new FormControl('');
    this.mailChimpList = new FormControl('');
    this.mailChimpEmail = new FormControl('');
    this.mailChimpFromName = new FormControl('');

    this.coinName = new FormControl('', Validators.required);
    this.coinCurrency = new FormControl('', Validators.required);
    this.coinValue = new FormControl('', Validators.required);

    this.currency = new FormControl('', Validators.required);
    this.currencyCode = new FormControl('', Validators.required);
  }

  createForm() {
    this.form = new FormGroup({
      cutOffValue: this.cutOffValue,
      affiliationFee: this.affiliationFee,
      affiliationAmount: this.affiliationAmount,
      withdrawalFee: this.withdrawalFee,
      transferFee: this.transferFee,
      withdrawalAutoLimit: this.withdrawalAutoLimit,
      withdrawalMinLimit: this.withdrawalMinLimit,
      withdrawalMaxLimit: this.withdrawalMaxLimit,
      transferPerUserDayLimit: this.transferPerUserDayLimit,
      transferCoinPerUserDayLimit: this.transferCoinPerUserDayLimit,
      mailChimpKey: this.mailChimpKey,
      mailChimpList: this.mailChimpList,
      mailChimpEmail: this.mailChimpEmail,
      mailChimpFromName: this.mailChimpFromName
    });
    this.coinForm = new FormGroup({
      coinName: this.coinName,
      coinCurrency: this.coinCurrency,
      coinValue: this.coinValue
    });
    this.currencyForm = new FormGroup({
      currency: this.currency,
      currencyCode: this.currencyCode
    });
  }

  enableDisable() {
    let settingData = {
      cutOffValue: this.form.value.cutOffValue,
      affiliationFee: this.form.value.affiliationFee,
      affiliationAmount: this.form.value.affiliationAmount,
      withdrawalFee: this.form.value.withdrawalFee,
      transferFee: this.form.value.transferFee,
      withdrawalAutoLimit: this.form.value.withdrawalAutoLimit,
      withdrawalMinLimit: this.form.value.withdrawalMinLimit,
      withdrawalMaxLimit: this.form.value.withdrawalMaxLimit,
      transferPerUserDayLimit: this.form.value.transferPerUserDayLimit,
      mailChimpKey: this.form.value.mailChimpKey,
      mailChimpList: this.form.value.mailChimpList,
      mailChimpEmail: this.form.value.mailChimpEmail,
      mailChimpFromName: this.form.value.mailChimpFromName,
      enableDisable: 1
    }

    this.bbService.adminSettings(settingData)
    .subscribe((res) => {
      if (!res.hasError) {
        this.successMessage = res.message;
        this.errorMessage = null;
        this.getSettings();
      } else {
        this.errorMessage = res.message;
        this.successMessage = null;
      }
    });
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.getSettings();
  }
}
