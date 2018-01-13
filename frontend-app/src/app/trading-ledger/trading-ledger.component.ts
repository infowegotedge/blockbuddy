import { Component, OnInit } from '@angular/core';
import { BBService } from '../bb.service';
import { Constants } from '../app.constants';

@Component({
  selector: 'app-trading-ledger',
  templateUrl: './trading-ledger.component.html',
  styleUrls: ['./trading-ledger.component.css']
})
export class TradingLedgerComponent implements OnInit {

  shares: any = [];
  totalShares: number;
  currentSharesPage: number;
  sharesMaxSize: number;
  perPageItem: number;
  noSharesData: string;
  typeShare: string;
  transactions: any = [];
  totalTransactions: number;
  transactionMessage: string;
  currentPage: number;

  constructor(private bbService: BBService) {
    this.sharesMaxSize = Constants.MAX_PAGE_SIZE;
    this.perPageItem   = Constants.PAGINATION_SIZE;
  }

  // getShares(pageNumber) {
  //   this.typeShare = '';
  //   let page = (pageNumber || 1);
  //   this.bbService.getLedgerShares(page)
  //   .subscribe((res) => {
  //     this.shares = res.data || [];
  //     this.totalShares = res.total;
  //     this.currentSharesPage = pageNumber;
  //     if (res.data.length == 0) {
  //       this.noSharesData = Constants.NO_TRANSACTION_FOUND;
  //     }
  //   });
  // }

  showBKN(currencyCode, pageNumber) {
    this.typeShare = '( BKN )';
    let page = (pageNumber || 1);
    this.transactionMessage = null;
    this.bbService.getLedgerWallet(currencyCode, page)
    .subscribe((res) => {
      if (res.error) {
        this.transactionMessage = res.message;
      } else {
        this.transactions = res.data || [];
        this.totalTransactions = res.count;
        this.currentPage = res.currentPage;
        for (let i = 0; i < this.transactions.length; i++) {
          this.transactions[i]['tranxID'] = this.transactions[i].traderWalletLedgerID;
        }
        if (this.transactions.length == 0) {
          this.transactionMessage = Constants.NO_TRANSACTION_FOUND;
        }
      }
    });
  }

  showBV(currencyCode, pageNumber) {
    this.typeShare = '( BV )';
    let page = (pageNumber || 1);
    this.transactionMessage = null;
    this.bbService.getLedgerWallet(currencyCode, page)
    .subscribe((res) => {
      if (res.error) {
        this.transactionMessage = res.message;
      } else {
        this.transactions = res.data || [];
        this.totalTransactions = res.count;
        this.currentPage = res.currentPage;
        for (let i = 0; i < this.transactions.length; i++) {
          this.transactions[i]['tranxID'] = this.transactions[i].traderWalletLedgerID;
        }
        if (this.transactions.length == 0) {
          this.transactionMessage = Constants.NO_TRANSACTION_FOUND;
        }
      }
    });
  }

  showEuro(currencyCode, pageNumber) {
    this.typeShare = '( EURO )';
    let page = (pageNumber || 1);
    this.transactionMessage = null;
    this.bbService.getLedgerWallet(currencyCode, page)
    .subscribe((res) => {
      if (res.error) {
        this.transactionMessage = res.message;
      } else {
        this.transactions = res.data || [];
        this.totalTransactions = res.count;
        this.currentPage = res.currentPage;
        for (let i = 0; i < this.transactions.length; i++) {
          this.transactions[i]['tranxID'] = this.transactions[i].traderWalletLedgerID;
        }
        if (this.transactions.length == 0) {
          this.transactionMessage = Constants.NO_TRANSACTION_FOUND;
        }
      }
    });
  }

  showVanguard(companyCode, pageNumber) {
    this.typeShare = '( VANGUARD )';
    let page = (pageNumber || 1);
    this.transactionMessage = null;
    this.bbService.getLedgerShares(companyCode, page)
    .subscribe((res) => {
      if (res.error) {
        this.transactionMessage = res.message;
      } else {
        this.transactions = res.data || [];
        this.totalTransactions = res.count;
        this.currentPage = res.currentPage;
        for (let i = 0; i < this.transactions.length; i++) {
          this.transactions[i]['tranxID'] = this.transactions[i].traderPortfolioLedgerID;
        }
        if (this.transactions.length == 0) {
          this.transactionMessage = Constants.NO_TRANSACTION_FOUND;
        }
      }
    });
  }

  showTentaneum(companyCode, pageNumber) {
    this.typeShare = '( TENTANEUM )';
    let page = (pageNumber || 1);
    this.transactionMessage = null;
    this.bbService.getLedgerShares(companyCode, page)
    .subscribe((res) => {
      if (res.error) {
        this.transactionMessage = res.message;
      } else {
        this.transactions = res.data || [];
        this.totalTransactions = res.count;
        this.currentPage = res.currentPage;
        for (let i = 0; i < this.transactions.length; i++) {
          this.transactions[i]['tranxID'] = this.transactions[i].traderPortfolioLedgerID;
        }
        if (this.transactions.length == 0) {
          this.transactionMessage = Constants.NO_TRANSACTION_FOUND;
        }
      }
    });
  }

  showDigitex(companyCode, pageNumber) {
    this.typeShare = '( DIGITEX )';
    let page = (pageNumber || 1);
    this.transactionMessage = null;
    this.bbService.getLedgerShares(companyCode, page)
    .subscribe((res) => {
      if (res.error) {
        this.transactionMessage = res.message;
      } else {
        this.transactions = res.data || [];
        this.totalTransactions = res.count;
        this.currentPage = res.currentPage;
        for (let i = 0; i < this.transactions.length; i++) {
          this.transactions[i]['tranxID'] = this.transactions[i].traderPortfolioLedgerID;
        }
        if (this.transactions.length == 0) {
          this.transactionMessage = Constants.NO_TRANSACTION_FOUND;
        }
      }
    });
  }

  getTransactions(_currentPage) {
    switch (this.typeShare) {
      case '( BKN )':
        return this.showBKN('BKN', _currentPage);
      case '( BV )':
        return this.showBV('BV', _currentPage);
      case '( EURO )':
        return this.showEuro('EURO', _currentPage);
      case '( VANGUARD )':
        return this.showVanguard('VANGUARD', _currentPage);
      case '( TENTANEUM )':
        return this.showTentaneum('TENTANIUM', _currentPage);
      case '( DIGITEX )':
        return this.showDigitex('DIGITEX', _currentPage);
    }
    // // this.bbService.transactionsWithdrawTransfer(_currentPage)
    // this.bbService.getLedgerWallets(_currentPage)
    // .subscribe((res) => {
    //   if (res.error) {
    //     this.transactionMessage = res.message;
    //   } else {
    //     // this.transactions = res.transactions;
    //     this.transactions = res.data || [];
    //     this.totalTransactions = res.count;
    //     this.currentPage = res.currentPage;
    //     if (this.transactions.length == 0) {
    //       this.transactionMessage = Constants.NO_TRANSACTION_FOUND;
    //     }
    //   }
    // })
  }

  ngOnInit() {
    // this.getShares(null);
    this.typeShare = '( BKN )'
    this.getTransactions(1);
  }

}
