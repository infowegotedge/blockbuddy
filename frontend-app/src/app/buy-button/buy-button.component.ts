import { Component, ViewChild, OnInit, NgZone, Input } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { BBService } from '../bb.service';
import { WindowRef } from '../app.windows';
import { JQueryWork } from '../app.jquery';

@Component({
  selector: 'app-buy-button',
  templateUrl: './buy-button.component.html',
  styleUrls: ['./buy-button.component.css']
})
export class BuyButtonComponent implements OnInit {

  btcBuySuccess: string;
  btcAmount: number;
  showLoader: boolean;
  successMessage: string;
  errorMessage: string;

  form: FormGroup;
  name: FormControl;
  value: FormControl;
  paymentType: FormControl;

  payza: boolean;
  payzaForm: FormGroup;
  ap_merchant: FormControl;
  ap_purchasetype: FormControl;
  ap_itemname: FormControl;
  ap_amount: FormControl;
  ap_currency: FormControl;
  ap_quantity: FormControl;
  ap_itemcode: FormControl;
  ap_description: FormControl;
  ap_returnurl: FormControl;
  ap_cancelurl: FormControl;
  ap_taxamount: FormControl;
  ap_additionalcharges: FormControl;
  ap_shippingcharges: FormControl;
  ap_testmode: FormControl;
  ap_alerturl: FormControl;
  apc_1: FormControl;
  ap_timeunit: FormControl;
  ap_periodlength: FormControl;
  ap_periodcount: FormControl;
  ap_setupamount: FormControl;

  @Input('amount') amount: number;
  @Input('label') label: string;
  @Input('product-name') productName: string;
  @Input('data-value') product: string;
  @Input('subscription') subscription: number;
  @Input('subscription-timeunit') timeunit: string;
  @Input('subscription-periodlength') periodlength: string;
  @Input('subscription-periodcount') periodcount: string;
  @Input('subscription-setupamount') setupamount: number; 
  @ViewChild('productModal') public productModal:ModalDirective;
  constructor(private bbService: BBService, private _ngZone: NgZone, private _exWork: JQueryWork, private _windows: WindowRef) {
  }

  public hideModal(): void {
    this.productModal.hide();
  }

  showPopup() {
    this.form.controls['name'].setValue(this.productName);
    this.form.controls['value'].setValue(this.amount);
    this.productModal.show();
  }

  doBuyForm(formPayza) {
    if (this.form.valid) {
      let paymentOption = this.form.value.paymentType || 'EXPAY';
      this.showLoader = true;
      let time = (new Date()).getTime();
      let purchaseData = {
        productId: this.product,
        name: this.productName,
        quanitity: this.form.value.value,
        price: "1.00",
        amount: this.form.value.value,
        status: "PROCESSING",
        order_id: time,
        purchase_id: time
      };

      if (paymentOption === 'EXPAY') {
        purchaseData['payment_method'] = 'EXPAY';
        purchaseData['payment_type']   = 'EXPAY';

        this.bbService.bookOrderExPay(purchaseData)
        .subscribe((res) => {
          if (!res.error) {
            this._windows.nativeWindow.location.href = res.payment.redirect;
          } else {
            alert('Payment Failed.');
          }
          this.showLoader = false;
        });

      } else if (paymentOption === 'PAYZA') {
        purchaseData['payment_method'] = 'PAYZA';
        purchaseData['payment_type']   = 'PAYZA';

        this.bbService.bookOrderPayza(purchaseData)
        .subscribe((res) => {
          if (!res.error) {
            this.payza = true;
            let payzaInfo = JSON.parse(atob(res.payment.payza.payConfig));
            let payzaSubmit = this._exWork.formSubmit(payzaInfo, res.payment.timezone, {
              'subscription': (this.subscription || 0),
              'timeunit': (this.timeunit || ''),
              'periodlength': (this.periodlength || ''),
              'periodcount': (this.periodcount || ''),
              'setupamount': (this.setupamount || 0)
            });

          } else {
            alert('Payment Failed.');
          }
          this.showLoader = false;
        });
      }
    }
  }

  createFormControls() {
    this.name = new FormControl('', [
      Validators.required
    ]);
    this.value = new FormControl('', [
      Validators.required
    ]);
    this.paymentType = new FormControl('');

    this.ap_merchant          = new FormControl('');
    this.ap_purchasetype      = new FormControl('');
    this.ap_itemname          = new FormControl('');
    this.ap_amount            = new FormControl('');
    this.ap_currency          = new FormControl('');
    this.ap_quantity          = new FormControl('');
    this.ap_itemcode          = new FormControl('');
    this.ap_description       = new FormControl('');
    this.ap_returnurl         = new FormControl('');
    this.ap_cancelurl         = new FormControl('');
    this.ap_taxamount         = new FormControl('');
    this.ap_additionalcharges = new FormControl('');
    this.ap_shippingcharges   = new FormControl('');
    this.ap_testmode          = new FormControl('');
    this.ap_alerturl          = new FormControl('');
    this.apc_1                = new FormControl('');
    this.ap_timeunit          = new FormControl('');
    this.ap_periodlength      = new FormControl('');
    this.ap_periodcount       = new FormControl('');
    this.ap_setupamount       = new FormControl('');
  }

  createForm() {
    this.form = new FormGroup({
      name: this.name,
      value: this.value,
      paymentType: this.paymentType
    });

    this.payzaForm = new FormGroup({
      ap_merchant: this.ap_merchant,
      ap_purchasetype: this.ap_purchasetype,
      ap_itemname: this.ap_itemname,
      ap_amount: this.ap_amount,
      ap_currency: this.ap_currency,
      ap_quantity: this.ap_quantity,
      ap_itemcode: this.ap_itemcode,
      ap_description: this.ap_description,
      ap_returnurl: this.ap_returnurl,
      ap_cancelurl: this.ap_cancelurl,
      ap_taxamount: this.ap_taxamount,
      ap_additionalcharges: this.ap_additionalcharges,
      ap_shippingcharges: this.ap_shippingcharges,
      ap_testmode: this.ap_testmode,
      ap_alerturl: this.ap_alerturl,
      apc_1: this.apc_1,
      ap_timeunit: this.ap_timeunit,
      ap_periodlength: this.ap_periodlength,
      ap_periodcount: this.ap_periodcount,
      ap_setupamount: this.ap_setupamount
    });
  }

  ngOnInit() {
    this.payza = false;
    this.createFormControls();
    this.createForm();
  }
}
