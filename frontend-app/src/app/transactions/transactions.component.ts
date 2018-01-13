import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../bb.service';
import { Constants } from '../app.constants';
import { WindowRef } from '../app.windows';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  private btcInfo:any = {};
  private usdInfo:any = {};
  private maxSize:number = 5;
  transfer:any = {};
  withdrawalToken:string;
  transferToken:string;
  withdrawalError:string;
  withdrawalSuccess:string;
  transferSuccess:string;
  balanceError:string;
  transferError:string;
  currentPage:number = 1;
  transactionMessage:string;
  transactions:any = [];
  otpStatus:boolean;
  totalTransactions:number;
  itemPerPage:number = 25;
  transactionsMaxSize:number = 0;
  perPageItem: number;

  profile: any = {};
  orderStatusInfo: string;
  orderStatus: any = {};

  @ViewChild('invoiceModal') public invoiceModal: ModalDirective;
  constructor(private bbService: BBService, private _windows: WindowRef) {
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.transactionsMaxSize = Constants.MAX_PAGE_SIZE;
  }

  getTransactions(_currentPage) {
    this.bbService.transactions(_currentPage)
    .subscribe((res) => {
      if (res.message) {
        this.transactionMessage = res.message;
      } else {
        this.transactions = res.transactions;
        this.totalTransactions = res.totalRows;
        this.itemPerPage = res.perPage;
        this.currentPage = res.currentPage;
        if (res.transactions.length == 0) {
          this.transactionMessage = Constants.NO_TRANSACTION_FOUND;
        }
      }
    })
  }

  getProfile() {
    this.bbService.getProfile()
    .subscribe((resProfile) => {
      if (!resProfile.hasError) {
        this.profile = resProfile.user;
      }
    });
  }

  getOrderInfo(orderId, status) {
    if (orderId && orderId !== '') {
      this.bbService.purchaseOrder(orderId)
      .subscribe((res) => {
        if (!res.hasError) {
          this.orderStatus = res.payment;
          this.orderStatusInfo = status;
          this.invoiceModal.show();
        }
      });
    }
  }

  printInvoice() {
    this._windows.nativeWindow.print();
  }

  public hideModal(): void {
    this.invoiceModal.hide();
  }

  ngOnInit() {
    this.getTransactions(1);
    this.getProfile();
  }

}
