import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BBService } from '../bb.service';
import { WindowRef } from '../app.windows';

@Component({
  selector: 'app-purchase-sf',
  templateUrl: './purchase-sf.component.html',
  styleUrls: ['./purchase-sf.component.css']
})
export class PurchaseSfComponent implements OnInit {

  orderId: string;
  messageType: string;
  orderStatus: any = {};
  profile: any = {};

  constructor(private bbService: BBService, private route: ActivatedRoute, private _windows: WindowRef) {
    this.messageType = this.route.snapshot.params.message;
    this.orderId     = this.route.snapshot.params.order;
  }

  getOrderInfo() {
    if (this.orderId && this.orderId !== '') {
      this.bbService.getProfile()
      .subscribe((resProfile) => {
        this.bbService.purchaseOrder(this.orderId)
        .subscribe((res) => {
          if (!res.hasError && !resProfile.hasError) {
            this.orderStatus = res.payment;
            this.profile     = resProfile.user;
          }
        });
      });
    }
  }

  printInvoice() {
    this._windows.nativeWindow.print();
  }

  ngOnInit() {
    this.getOrderInfo();
  }

}
