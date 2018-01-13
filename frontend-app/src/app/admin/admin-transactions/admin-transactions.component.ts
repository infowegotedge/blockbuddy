import { Component, OnInit } from '@angular/core';
import { BBService } from '../../bb.service';
import { Constants } from '../../app.constants';

@Component({
  selector: 'app-admin-transactions',
  templateUrl: './admin-transactions.component.html',
  styleUrls: ['./admin-transactions.component.css']
})
export class AdminTransactionsComponent implements OnInit {
  transfers: any = {};
  totalTransfer: number = 0;
  currentPage: number = 1;
  transferMaxSize: number = 0;
  perPageItem: number;

  constructor(private bbService:BBService) {
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.transferMaxSize = Constants.MAX_PAGE_SIZE;
  }

  getTransfers(page) {
    let query = {'page': (page || 1)};

    this.bbService.getTransfers(query)
    .subscribe((res) => {
      this.transfers       = res.transfers;
      this.totalTransfer   = res.totalRows;
      this.currentPage     = res.currentPage;
    });
  }

  ngOnInit() {
    this.getTransfers(null);
  }

}
