import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../../bb.service';
import { Constants } from '../../app.constants';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-company',
  templateUrl: './admin-company.component.html',
  styleUrls: ['./admin-company.component.css']
})
export class AdminCompanyComponent implements OnInit {

  public title: string = '<strong>Company Block!!!</strong>';
  public message: string = '<strong>Are you sure</strong>, you want to block this Company!!!<br/><br/>';

  public untitle: string = '<strong>Company Unblock!!!</strong>';
  public unmessage: string = '<strong>Are you sure</strong>, you want to unblock this Company!!!<br/><br/>';
  
  allCompanies: any = [];
  allCurrency: any = [];
  companies: any = [];
  companycode: string;
  perPageItem: number;
  companyMaxSize: number;
  currentPage: number;
  totalPage: number;
  noCompanyFound: string;
  updateError: string;
  updateSuccess: string;
  numberPattern: string;
  transferError: string;
  transferSuccess: string;
  transferWalletError: string;
  transferWalletSuccess: string;
  companyUpdate: boolean = false;

  form: FormGroup;
  transferFrom: FormGroup;
  transferWalletFrom: FormGroup;
  companyCode: FormControl;
  companyName: FormControl;
  companyShortDescription: FormControl;
  companyLongDescription: FormControl;
  companyAddress: FormControl;
  companyURL: FormControl;
  companyEmail: FormControl;
  companyContactNumber: FormControl;
  transferCompanyCode: FormControl;
  transferUsername: FormControl;
  transferAmount: FormControl;
  transferWalletCurrencyCode: FormControl;
  transferWalletUserName: FormControl;
  transferWalletAmount: FormControl;

  @ViewChild('companyModal') public companyModal:ModalDirective;
  @ViewChild('transferModal') public transferModal:ModalDirective;
  @ViewChild('transferWalletModal') public transferWalletModal:ModalDirective;
  constructor(private bbService:BBService, private _ngZone: NgZone) {
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.companyMaxSize = Constants.MAX_PAGE_SIZE;
    this.numberPattern = Constants.NUMBER_PATTER;
  }

  getCompany() {
    this.bbService.getCompanies()
    .subscribe(_res => {
      this.allCompanies = [];
      if(!_res.error) {
        this.allCompanies = _res.data || [];
      }
    });
  }

  getCurrencies() {
    this.bbService.getCurrency()
    .subscribe(_res => {
      this.allCurrency = [];
      if(!_res.error) {
        this.allCurrency = _res.data || [];
      }
    });
  }

  getCompaniesList(pageNumber) {
    let page = (pageNumber || 1);

    this.bbService.getCompanyListAll(page)
    .subscribe(_res => {
      if(!_res.error) {
        this.companies = _res.data || [];
        this.currentPage = _res.currentPage;
        this.totalPage   = _res.count;
        this.noCompanyFound = null;
      }
      else {
        this.noCompanyFound = 'No Company Found.';
      }
    });
  }

  private filterById(obj, code) {
    return obj.filter((el) =>
      el.companyCode === code
    );
  }

  transferCoinsModalShow() {
    this.transferFrom.controls['transferCompanyCode'].setValue('');
    this.transferFrom.controls['transferUsername'].setValue('');
    this.transferFrom.controls['transferAmount'].setValue(0);
    this.transferError = null;
    this.transferSuccess = null;
    this.getCompany();
    this.transferModal.show();
  }

  transferCoins() {
    this.transferError = null;
    if(this.transferFrom.valid) {

      let transferData = {
        companyCode: this.transferFrom.value.transferCompanyCode,
        userName: this.transferFrom.value.transferUsername,
        total: this.transferFrom.value.transferAmount,
      }

      this.bbService.transferManuallyShares(transferData)
      .subscribe(_res => {
        if(!_res.error) {
          this.transferError = null;
          this.transferSuccess = _res.message;
          this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
              this._ngZone.run(() => {
                this.hideModal();
              })
            }, 3000);
          });
        }
        else {
          this.transferError = _res.message;
          this.transferSuccess = null;
        }
      });
    }
    else {
      this.transferError = 'Validation error, Please correct it.'
    }
  }

  transferWalletModalShow() {
    this.transferWalletFrom.controls['transferWalletCurrencyCode'].setValue('');
    this.transferWalletFrom.controls['transferWalletUserName'].setValue('');
    this.transferWalletFrom.controls['transferWalletAmount'].setValue(0);
    this.transferWalletError = null;
    this.transferWalletSuccess = null;
    this.getCurrencies();
    this.transferWalletModal.show();
  }

  transferWallet() {
    this.transferWalletError = null;
    if(this.transferWalletFrom.valid) {

      let transferWalletData = {
        currencyCode: this.transferWalletFrom.value.transferWalletCurrencyCode,
        userName: this.transferWalletFrom.value.transferWalletUserName,
        total: this.transferWalletFrom.value.transferWalletAmount,
      }
      
      this.bbService.transferWalletManually(transferWalletData)
      .subscribe(_res => {
        if(!_res.error) {
          this.transferWalletError = null;
          this.transferWalletSuccess = _res.message;
          this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
              this._ngZone.run(() => {
                this.hideModal();
              })
            }, 3000);
          });
        }
        else {
          this.transferWalletError = _res.message;
          this.transferWalletSuccess = null;
        }
      });
    }
    else {
      this.transferWalletError = 'Validation error, Please correct it.'
    }
  }

  updateCompany(companyCode) {
    let company = this.filterById(this.companies, companyCode);
    company = ((company && company[0]) ? company[0] : {});
    this.updateError = null;
    this.updateSuccess = null;
    this.form.controls['companyCode'].setValue(company.companyCode);
    this.form.controls['companyName'].setValue(company.companyName);
    this.form.controls['companyShortDescription'].setValue(company.companyShortDescription);
    this.form.controls['companyLongDescription'].setValue(company.companyLongDescription);
    this.form.controls['companyAddress'].setValue(company.companyAddress);
    this.form.controls['companyURL'].setValue(company.companyURL);
    this.form.controls['companyEmail'].setValue(company.companyEmail);
    this.form.controls['companyContactNumber'].setValue(company.companyContactNumber);
    this.companyUpdate = true;
    this.companyModal.show();
  }

  createCompany() {
    if(this.companyUpdate === false) {
      let companyData = {
        companyCode: this.form.value.companyCode,
        companyName: this.form.value.companyName,
        companyShortDescription: (this.form.value.companyShortDescription || ' '),
        companyLongDescription: (this.form.value.companyLongDescription || ' '),
        companyAddress: (this.form.value.companyAddress || ' '),
        companyURL: (this.form.value.companyURL || ' '),
        companyEmail: (this.form.value.companyEmail || ' '),
        companyContactNumber: (this.form.value.companyContactNumber || ' '),
      }
  
      this.bbService.postCompany(companyData)
      .subscribe(_res => {
        if(!_res.error) {
          this.updateError = null;
          this.updateSuccess = _res.message;
          this.getCompaniesList(null);
          this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
              this._ngZone.run(() => {
                this.hideModal();
              })
            }, 3000);
          });
        }
        else {
          this.updateError = _res.message;
          this.updateSuccess = null;
        }
      });
    }
    else if(this.companyUpdate === true) {
      this.companyUpdate = false;
      let companyData = {
        companyName: this.form.value.companyName,
        companyShortDescription: (this.form.value.companyShortDescription || ' '),
        companyLongDescription: (this.form.value.companyLongDescription || ' '),
        companyAddress: (this.form.value.companyAddress || ' '),
        companyURL: (this.form.value.companyURL || ' '),
        companyEmail: (this.form.value.companyEmail || ' '),
        companyContactNumber: (this.form.value.companyContactNumber || ' '),
      }

      this.bbService.putCompany(this.form.value.companyCode, companyData)
      .subscribe(_res => {
        if(!_res.error) {
          this.updateError = null;
          this.updateSuccess = _res.message;
          this.getCompaniesList(null);
          this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
              this._ngZone.run(() => {
                this.hideModal();
              })
            }, 3000);
          });
        }
        else {
          this.updateError = _res.message;
          this.updateSuccess = null;
        }
      });
    }
  }

  getBlockCompany(companyCode) {
    let that = this;
    this.bbService.deleteCompany(companyCode)
    .subscribe(_res => {
      that.getCompaniesList(null);
    });
  }

  getUnBlockCompany(companyCode) {
    let that = this;
    this.bbService.putEnableCompany(companyCode)
    .subscribe(_res => {
      that.getCompaniesList(null);
    });
  }

  hideModal(): void {
    this.updateError = null;
    this.updateSuccess = null;
    this.transferError = null;
    this.transferSuccess = null;
    this.transferWalletError = null;
    this.transferWalletSuccess = null;

    this.companyModal.hide();
    this.transferModal.hide();
    this.transferWalletModal.hide();
  }

  companyModalShow() {
    this.companyModal.show();
  }

  createFormControls() {
    this.companyCode = new FormControl('', [
      Validators.required
    ]);
    this.companyName = new FormControl('', [
      Validators.required
    ]);
    this.companyShortDescription = new FormControl('');
    this.companyLongDescription = new FormControl('');
    this.companyAddress = new FormControl('');
    this.companyURL = new FormControl('');
    this.companyEmail = new FormControl('');
    this.companyContactNumber = new FormControl('');

    this.transferCompanyCode = new FormControl('', [
      Validators.required
    ]);
    this.transferUsername = new FormControl('', [
      Validators.required
    ]);
    this.transferAmount = new FormControl('', [
      Validators.required,
      Validators.pattern(this.numberPattern)
    ]);

    this.transferWalletCurrencyCode = new FormControl('', [
      Validators.required
    ]);
    this.transferWalletUserName = new FormControl('', [
      Validators.required
    ]);
    this.transferWalletAmount = new FormControl('', [
      Validators.required,
      Validators.pattern(this.numberPattern)
    ]);
  }

  createForm() {
    this.form = new FormGroup({
      companyCode: this.companyCode,
      companyName: this.companyName,
      companyShortDescription: this.companyShortDescription,
      companyLongDescription: this.companyLongDescription,
      companyAddress: this.companyAddress,
      companyURL: this.companyURL,
      companyEmail: this.companyEmail,
      companyContactNumber: this.companyContactNumber,
    });

    this.transferFrom = new FormGroup({
      transferCompanyCode: this.transferCompanyCode,
      transferUsername: this.transferUsername,
      transferAmount: this.transferAmount
    });

    this.transferWalletFrom = new FormGroup({
      transferWalletCurrencyCode: this.transferWalletCurrencyCode,
      transferWalletUserName: this.transferWalletUserName,
      transferWalletAmount: this.transferWalletAmount
    });
  }

  ngOnInit() {
    this.getCompaniesList(null);
    this.createFormControls();
    this.createForm();
  }

}
