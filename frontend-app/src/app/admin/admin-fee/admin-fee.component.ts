import { Component, OnInit } from '@angular/core';
import { BBService } from '../../bb.service';
import { Constants } from '../../app.constants';

@Component({
  selector: 'app-admin-fee',
  templateUrl: './admin-fee.component.html',
  styleUrls: ['./admin-fee.component.css']
})
export class AdminFeeComponent implements OnInit {
  dt: any = {};
  commissionFee: any = {};
  totalAffiliation: number = 0;
  aCurrentPage: number = 1;
  affiliationMaxSize: number = 0;
  withdrawalFee: any = {};
  totalWithdrawal: number = 0;
  wCurrentPage: number = 1;
  withdrawalMaxSize: number = 0;
  transferFee: any = {};
  totalTransfer: number = 0;
  tCurrentPage: number = 1;
  transferMaxSize: number = 0;
  perPageItem: number;
  totalTransferFee: number;
  totalWithdrawalFee: number;
  totalCommissionFee: number;

  constructor(private bbService: BBService) {
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.affiliationMaxSize = Constants.MAX_PAGE_SIZE;
    this.withdrawalMaxSize  = Constants.MAX_PAGE_SIZE;
    this.transferMaxSize    = Constants.MAX_PAGE_SIZE;
  }

  getCommissionFee(page) {
    let query = {'page': (page || 1)};

    this.bbService.getCommissionFee(query)
    .subscribe((res) => {
      this.commissionFee      = res.commissions;
      this.totalAffiliation   = res.totalRows;
      this.aCurrentPage       = res.currentPage;
      this.totalCommissionFee = res.totalCommission;
    });
  }

  getWithdrawalFee(page) {
    let query = {'page': (page || 1)};

    this.bbService.getWithdrawalFee(query)
    .subscribe((res) => {
      this.withdrawalFee      = res.withdrawals;
      this.totalWithdrawal    = res.totalRows;
      this.wCurrentPage       = res.currentPage;
      this.totalWithdrawalFee = res.totalFee;
    });
  }

  getTransferFee(page) {
    let query = {'page': (page || 1)};

    this.bbService.getTransferFee(query)
    .subscribe((res) => {
      this.transferFee      = res.transfers;
      this.totalTransfer    = res.totalRows;
      this.tCurrentPage     = res.currentPage;
      this.totalTransferFee = res.totalFee;
    });
  }

  ngOnInit() {
    this.totalTransfer = 0;
    this.getTransferFee(null);
    this.getWithdrawalFee(null);
    this.getCommissionFee(null);
  }

}
