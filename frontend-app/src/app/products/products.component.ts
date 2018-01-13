import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../bb.service';
import { Constants } from '../app.constants';
// import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { WindowRef } from '../app.windows';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: any = [];
  totalProducts: number = 0;
  currentPage: number = 1;
  productsMaxSize: number = 0;
  perPageItem: number;
  successMessage: string;
  errorMessage: string;
  product: any = {};
  companies: any = [];
  shares: any = {};
  productSku: string;
  imageArray: any = {};
  coinName: string;

  btcBuySuccess: string;
  btcAmount: number;
  showLoader: boolean;

  form: FormGroup;
  name: FormControl;
  value: FormControl;
  paymentType: FormControl;

  @ViewChild('productModal') public productModal:ModalDirective;
  constructor(
    private bbService: BBService,
    private _ngZone: NgZone,
    // private route: ActivatedRoute,
    private _windows: WindowRef
  ) {
    this.imageArray = {
      'vanguard': 'assets/images/coin-van.png',
      'digitex': 'assets/images/coin-digi.png',
      'tentanium': 'assets/images/coin-tent.png'
    }

    // this.coinName = this.route.snapshot.params.coinsName;
  }

  getCompanies() {
    this.bbService.getCompanies()
    .subscribe((res) => {
      this.companies = res.data || [];
      let shares = {};
      for (let i = 0; i < this.companies.length; i++) {
        shares[this.companies[i].companyCode] = this.getCompanyShares(this.companies[i].companyCode);
        this.shares[this.companies[i].companyCode] = { totalShares: 0 };
      }
    });
  }

  getCompanyShares(companyCode) {
    this.bbService.getCompanyShares(companyCode)
    .subscribe((res) => {
      let share = res.data || [];
      if ( share.length > 0 ) {
        this.shares[companyCode] = share[0];
      } else {
        this.shares[companyCode] = { totalShares: 0 };
      }
    });
  }

  // getProducts(page) {
  //   let query = {'page': (page || 1)};

  //   this.bbService.getUserStaticProducts(query)
  //   .subscribe((res) => {
  //     this.products      = res.data || [];
  //     this.totalProducts = res.totalRows;
  //     this.currentPage   = res.currentPage;
  //   });
  // }

  // public hideModal(): void {
  //   this.productModal.hide();
  // }

  // showPopup(index) {
  //   this.product = this.companies[index];
  //   this.form.controls['name'].setValue(this.product.companyName);
  //   this.form.controls['value'].setValue(0);
  //   this.productSku = this.product.companyCode;
  //   this.productModal.show();
  // }

  // doBuyForm() {
  //   if (this.form.valid) {
  //     let paymentOption = this.form.value.paymentType;
  //     this.showLoader = true;
  //     let time = (new Date()).getTime();
  //     let purchaseData = {
  //       productId: this.product._id,
  //       name: this.product.name,
  //       qunitity: this.form.value.value,
  //       price: "1.00",
  //       amount: this.form.value.value,
  //       status: "PROCESSING",
  //       order_id: time,
  //       purchase_id: time,
  //       payment_method: 'BTC',
  //       payment_type: 'BTC'
  //     };

  //     if (paymentOption === 'BTC') {
  //       this.bbService.bookOrder(purchaseData)
  //       .subscribe((res) => {
  //         if (!res.error) {
  //           this.btcBuySuccess = res.payment.address;
  //           this.btcAmount     = res.payment.btcAmount;
  //         } else {
  //           alert('Payment Failed.');
  //         }
  //         this.showLoader = false;
  //       });

  //     } else if (paymentOption === 'ECORE') {
  //       purchaseData['payment_method'] = 'EXPAY';
  //       purchaseData['payment_type']   = 'EXPAY';

  //       this.bbService.bookOrderExPay(purchaseData)
  //       .subscribe((res) => {
  //         if (!res.error) {
  //           this._windows.nativeWindow.location.href = res.payment.redirect;
  //         } else {
  //           alert('Payment Failed.');
  //         }
  //         this.showLoader = false;
  //       });
  //     }
  //   }
  // }

  // createFormControls() {
  //   this.name = new FormControl('', [
  //     Validators.required
  //   ]);
  //   this.value = new FormControl('', [
  //     Validators.required
  //   ]);
  //   this.paymentType = new FormControl('', [
  //     Validators.required
  //   ])
  // }

  // createForm() {
  //   this.form = new FormGroup({
  //     name: this.name,
  //     value: this.value,
  //     paymentType: this.paymentType
  //   });
  // }

  ngOnInit() {
    // this.getProducts(null)
    this.getCompanies();
    // this.createFormControls();
    // this.createForm();
    this.product = {};
  }

}
