import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../../bb.service';
import { Constants } from '../../app.constants';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {

  public title: string = '<strong>Product Deleted!!!</strong>';
  public message: string = '<strong>Are you sure</strong>, you want to Delete this Product!!!<br/><br/>';

  products: any = [];
  totalProducts: number = 0;
  currentPage: number = 1;
  productsMaxSize: number = 0;
  perPageItem: number;
  successMessage: string;
  errorMessage: string;
  numberPattern: string;
  noProductsFound: string;
  productMeta: any = {};
  compensationWallet: any = [];
  compensationPortfolio: any = [];
  allCurrency: any = [];
  allCompanies: any = [];
  successWalletMessage: string;
  errorWalletMessage: string;
  successMetaMessage: string;
  errorMetaMessage: string;
  successPortfolioMessage: string;
  errorPortfolioMessage: string;

  form: FormGroup;
  productType: FormControl;
  productSku: FormControl;
  description: FormControl;
  productName: FormControl;
  sellingPrice: FormControl;
  // productMeta: FormControl;
  // compensationWallet: FormControl;
  // compensationPortfolio: FormControl;
  productMetaForm: FormGroup;
  meta: FormControl;

  compensationWalletForm: FormGroup;
  walletCurrency: FormControl;
  walletAmount: FormControl;

  compensationPortfolioForm: FormGroup;
  portfolioCompany: FormControl;
  portfolioAmount: FormControl;

  @ViewChild('productModal') public productModal:ModalDirective;
  @ViewChild('productMetaModal') public productMetaModal:ModalDirective;
  @ViewChild('compensationWalletModal') public compensationWalletModal:ModalDirective;
  @ViewChild('compensationPortfolioModal') public compensationPortfolioModal:ModalDirective;
  constructor(private bbService: BBService, private _ngZone: NgZone) {
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.productsMaxSize = Constants.MAX_PAGE_SIZE;
    this.numberPattern = Constants.NUMBER_PATTER;
  }

  getProducts(page) {
    let query = {'page': (page || 1)};

    this.bbService.getProducts(query)
    .subscribe((res) => {
      this.products      = res.data || [];
      this.totalProducts = res.count;
      this.currentPage   = res.currentPage;
      this.noProductsFound = null;
      if(this.products.length === 0) {
        this.noProductsFound = Constants.NO_PRODUCT_FOUND;
      }
    });
  }

  deleteProduct(productId) {
    this.bbService.deleteProducts(productId)
    .subscribe((res) => {
      this.getProducts(null);
    });
  }

  saveProductMeta() {
    if(!this.productMeta.additional) {
      this.productMeta.additional = [];
    }

    if(this.productMetaForm.valid) {
      this.productMeta.additional.push(this.productMetaForm.value.meta);
      this.hideSubPopup();
    }
  }

  saveCompensationWallet() {
    if(this.compensationWalletForm.valid) {
      this.compensationWallet.push({
        currencyCode: this.compensationWalletForm.value.walletCurrency,
        total: this.compensationWalletForm.value.walletAmount
      });
      this.hideSubPopup();
    }
  }

  saveCompensationPortfolio() {

    if(this.compensationPortfolioForm.valid) {
      this.compensationPortfolio.push({
        companyCode: this.compensationPortfolioForm.value.portfolioCompany,
        total: this.compensationPortfolioForm.value.portfolioAmount
      });
      this.hideSubPopup();
    }
  }

  public hideSubPopup(): void {
    this.productMetaModal.hide();
    this.compensationWalletModal.hide();
    this.compensationPortfolioModal.hide();
  }

  public hideModal(): void {
    this.productModal.hide();
  }

  showPopup() {
    this.productModal.show();
  }

  saveProduct() {
    let productData = {
      productType: this.form.value.productType,
      productSku: this.form.value.productSku,
      description: this.form.value.description,
      productName: this.form.value.productName,
      sellingPrice: this.form.value.sellingPrice,
      productMeta: this.productMeta,
      compensationWallet: this.compensationWallet,
      compensationPortfolio: this.compensationPortfolio,
    }

    this.bbService.createProducts(productData)
    .subscribe((res) => {
      if (res.hasError) {
        this.errorMessage   = res.message;
        this.successMessage = null;
      } else {
        this.errorMessage   = null;
        this.successMessage = res.message;
        this.getProducts(null);
        this._ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this._ngZone.run(() => {
              this.successMessage = null;
              this.errorMessage   = null;
              this.productMeta = {};
              this.compensationWallet = [];
              this.compensationPortfolio = [];
              this.hideModal();
            })
          }, 3000);
        });
      }
    });
  }

  createFormControls() {

    this.productName = new FormControl('', [
      Validators.required
    ]);
    this.sellingPrice = new FormControl('', [
      Validators.required,
      Validators.pattern(this.numberPattern)
    ]);
    this.productSku = new FormControl('', [
      Validators.required
    ]);
    this.productType = new FormControl('', [
      Validators.required
    ]);
    this.description = new FormControl('', [
      Validators.required
    ]);

    this.meta = new FormControl('', [
      Validators.required
    ]);

    this.walletCurrency = new FormControl('', [
      Validators.required
    ]);
    this.walletAmount = new FormControl('', [
      Validators.required
    ])

    this.portfolioCompany = new FormControl('', [
      Validators.required
    ]); 
    this.portfolioAmount = new FormControl('', [
      Validators.required
    ]);
  }

  createForm() {
    this.form = new FormGroup({
      productType: this.productType,
      productSku: this.productSku,
      description: this.description,
      productName: this.productName,
      sellingPrice: this.sellingPrice
    });

    this.productMetaForm = new FormGroup({
      meta: this.meta
    })

    this.compensationWalletForm = new FormGroup({
      walletCurrency: this.walletCurrency,
      walletAmount: this.walletAmount
    });

    this.compensationPortfolioForm = new FormGroup({
      portfolioCompany: this.portfolioCompany,
      portfolioAmount: this.portfolioAmount
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

  getCompany() {
    this.bbService.getCompanies()
    .subscribe(_res => {
      this.allCompanies = [];
      if(!_res.error) {
        this.allCompanies = _res.data || [];
      }
    });
  }

  ngOnInit() {
    this.getProducts(null);
    this.createFormControls();
    this.createForm();
    this.getCompany();
    this.getCurrencies();
  }

}