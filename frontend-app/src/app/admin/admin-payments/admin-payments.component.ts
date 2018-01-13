import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../../bb.service';
import { Constants } from '../../app.constants';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-payments',
  templateUrl: './admin-payments.component.html',
  styleUrls: ['./admin-payments.component.css']
})
export class AdminPaymentsComponent implements OnInit {
  payments: any = [];
  completedPayments: any = [];
  pendingPayments: any = [];
  verifyPayments: any = [];
  paymentTypeString: string;
  totalPayments: number = 0;
  currentPage: number = 1;
  paymentsMaxSize: number = 0;
  perPageItem: number;
  btcBuySuccess: string;
  btcAmount: number;
  payment: any = {};
  paymentTabset: any;
  paymentTabsetInit: boolean;
  actionType: string;

  form: FormGroup;
  paymentType: FormControl;

  form1: FormGroup;
  cardNumber: FormControl;
  cardMonth: FormControl;
  cardYear: FormControl;
  cardCvv: FormControl;
  firstName: FormControl;
  lastName: FormControl;
  address: FormControl;
  city: FormControl;
  state: FormControl;
  phone: FormControl;
  postcode: FormControl;
  country: FormControl;
  amount: FormControl;
  product: FormControl;

  approvalForm: FormGroup;
  approvalAmount: FormControl;
  approvalDate: FormControl;
  approvalNotes: FormControl;

  @ViewChild('paymentModal') public paymentModal:ModalDirective;
  @ViewChild('ecoreModal') public ecoreModal:ModalDirective;
  @ViewChild('approvalModal') public approvalModal:ModalDirective;
  constructor(private bbService:BBService, private route: ActivatedRoute) {
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.paymentsMaxSize = Constants.MAX_PAGE_SIZE;
    this.paymentTypeString = this.route.snapshot.params.paymentType;
    if (!this.paymentTypeString) {
      this.paymentTypeString = '';
    }
  }

  beforeChange(event) {
    if (event.nextId === 'payemts') {
      this.getPayments(null);
    } else if (event.nextId === 'completed-payments') {
      this.getCompletedPayments(null);
    } else if (event.nextId === 'pending-payments') {
      this.getPendingPayments(null);
    } else if (event.nextId === 'approve-payments') {
      this.getVerifyPayments(null);
    }
  }

  paymentsTabsetEvent(paymentTabset) {
    if (this.paymentTabsetInit === false) {
      this.paymentTabsetInit = true;

      if (this.paymentTypeString === 'pending') {
        paymentTabset.select('pending-payments');
      } else if (this.paymentTypeString === 'completed') {
        paymentTabset.select('completed-payments');
      }
    }
  }

  getPayments(page) {
    let query = {'page': (page || 1)};

    if(this.actionType != '') {
      query['type'] = this.actionType;
    }

    this.bbService.getPayments(query)
    .subscribe((res) => {
      this.payments      = res.payments;
      this.totalPayments = res.totalRows;
      this.currentPage   = res.currentPage;
    });
  }

  getCompletedPayments(page) {
    let query = {'page': (page || 1)};
    query['status'] = 'COMPLETED';

    this.bbService.getPayments(query)
    .subscribe((res) => {
      this.completedPayments = res.payments;
      this.totalPayments     = res.totalRows;
      this.currentPage       = res.currentPage;
    });
  }

  getPendingPayments(page) {
    let query = {'page': (page || 1)};
    query['status'] = 'PENDING';

    this.bbService.getPayments(query)
    .subscribe((res) => {
      this.pendingPayments = res.payments;
      this.totalPayments   = res.totalRows;
      this.currentPage     = res.currentPage;
    });
  }

  getVerifyPayments(page) {
    let query = {'page': (page || 1)};
    query['status'] = 'VERIFY';

    this.bbService.getPayments(query)
    .subscribe((res) => {
      this.verifyPayments = res.payments;
      this.totalPayments  = res.totalRows;
      this.currentPage    = res.currentPage;
    });
  }

  getPaymentsTransaction(actionType) {
    this.actionType = actionType;
    this.getPayments(null);
  }

  getApproved(orderId) {

    this.bbService.updatePayments({'order': orderId})
    .subscribe((res) => {
      this.getVerifyPayments(1);
    });
  }

  getApprovedModal(index) {
    this.payment = this.payments[index];
    this.approvalModal.show();
  }

  approvePayments() {
    if (this.approvalForm.valid) {
      let approvalData = {
        notes: this.approvalForm.value.approvalNotes,
        order: this.payment.order_id
      }

      this.bbService.updatePayments(approvalData)
      .subscribe((res) => {
        this.getPayments(1);
        this.hideModal();
      });
    }
  }

  public hideModal(): void {
    this.paymentModal.hide();
    this.btcBuySuccess = null;
    this.approvalModal.hide();
  }

  public hideEcoreModal(): void {
    this.ecoreModal.hide();
  }

  buyNowPopup() {
    this.paymentModal.show();
  }

  ecorePopup() {
    this.form1.controls['product'].setValue('Test Payments');
    this.ecoreModal.show();
  }

  doBuyForm() {
    if (this.form.valid) {
      let paymentOption = this.form.value.paymentType;

      if (paymentOption === 'BTC') {
        let time = (new Date()).getTime();
        let purchaseData = {
          name: 'Test Product',
          qunitity: 1,
          price: "1.00",
          amount: "1.00",
          status: "PROCESSING",
          order_id: time,
          purchase_id: time,
          payment_method: 'BTC',
          payment_type: 'BTC'
        };

        this.bbService.bookOrder(purchaseData)
        .subscribe((res) => {
          if (!res.error) {
            this.btcBuySuccess = res.payment.address;
            this.btcAmount     = res.payment.btcAmount;
            this.getPayments(1);
          } else {
            alert('Payment Failed.');
          }
        });

      } else if (paymentOption === 'ECORE') {
        this.hideModal();
        this.ecorePopup();
      }
    }
  }

  doEcorePay() {
    console.log(this.form1.value);
  }

  createFormControls() {
    this.paymentType = new FormControl('', [
      Validators.required
    ]);

    this.cardNumber = new FormControl('', [
      Validators.required
    ]);

    this.cardMonth = new FormControl('', [
      Validators.required
    ]);

    this.cardYear = new FormControl('', [
      Validators.required
    ]);

    this.cardCvv = new FormControl('', [
      Validators.required
    ]);

    this.firstName = new FormControl('', [
      Validators.required
    ]);

    this.lastName = new FormControl('', [
      Validators.required
    ]);

    this.address = new FormControl('', [
      Validators.required
    ]);

    this.city = new FormControl('', [
      Validators.required
    ]);

    this.state = new FormControl('', [
      Validators.required
    ]);

    this.phone = new FormControl('', [
      Validators.required
    ]);

    this.postcode = new FormControl('', [
      Validators.required
    ]);

    this.country = new FormControl('', [
      Validators.required
    ]);

    this.amount = new FormControl('', [
      Validators.required
    ]);

    this.product = new FormControl('', [
      Validators.required
    ]);

    this.approvalAmount = new FormControl('', [
      Validators.required
    ]);
    this.approvalDate = new FormControl('');
    this.approvalNotes = new FormControl('', [
      Validators.required
    ]);
  }

  createForm() {
    this.form = new FormGroup({
      paymentType: this.paymentType,
    });

    this.form1 = new FormGroup({
      cardNumber: this.cardNumber,
      cardMonth: this.cardMonth,
      cardYear: this.cardYear,
      cardCvv: this.cardCvv,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      city: this.city,
      state: this.state,
      phone: this.phone,
      postcode: this.postcode,
      country: this.country,
      amount: this.amount,
      product: this.product,
    });

    this.approvalForm = new FormGroup({
      approvalNotes: this.approvalNotes
    });
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.paymentTabsetInit = false;
    if (this.paymentTypeString === '') {
      this.getPayments(null);
    } else if (this.paymentTypeString === 'pending') {
      this.getPendingPayments(null);
    } else if (this.paymentTypeString === 'completed') {
      this.getCompletedPayments(null);
    }
  }
}

