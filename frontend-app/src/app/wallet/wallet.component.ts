import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../bb.service';
import { Constants } from '../app.constants';
import { WindowRef } from '../app.windows';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})

export class WalletComponent implements OnInit {

  btcInfo:any = {};
  usdInfo:any = {};
  maxSize:number = 5;
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
  totalTransactions: number;
  itemPerPage:number = 25;
  transactionsMaxSize:number = 0;
  perPageItem: number;
  vanguard: number;
  digitex: number;
  bkn: number;
  tentanium: number;
  products: any = [];
  withdrawalRequest: string;
  traderWallet: any = [];
  companiesShares: any = [];
  hasShares: boolean = false;
  hasWalletBKN: boolean = false;
  bknValue: number;
  bvValue: number;
  transferIsBegan: boolean = false;
  veifyUser: any = {};
  transferDetails: any;

  @ViewChild('withdrawalModal') public withdrawalModal: ModalDirective;
  @ViewChild('transferModal') public transferModal: ModalDirective;
  @ViewChild('transferSureModal') public transferSureModal: ModalDirective;
  constructor(private bbService: BBService, private _windows: WindowRef) {
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.transactionsMaxSize = Constants.MAX_PAGE_SIZE;
  }

  // getBtcInfo() {
  //   this.bbService.btcInfo()
  //   .subscribe((res) => {
  //     if (!res.hasError) {
  //       this.btcInfo = res.btcWallet;
  //     }
  //   })
  // }

  showWithdrawalModal() {
    this.transferError = '';
    if (this.btcInfo.btcAmount > 0) {
      this.bbService.getWithdrawalToken()
      .subscribe((res) => {
        this.withdrawalToken = res.token;
        this.withdrawalModal.show();
      })
    } else {
      this.balanceError = Constants.WITHDRAWAL_BALANCE_ERROR;
      this.withdrawalModal.show();
    }
  }

  showTransferModal() {
    this.balanceError = '';
    if (this.hasShares || this.hasWalletBKN) {
      this.bbService.getTransferToken()
      .subscribe((res) => {
        this.transferToken = res.token;
        this.transferModal.show();
      })
    } else {
      this.balanceError = Constants.TRANSFER_BALANCE_ERROR;
      this.transferModal.show();
    }
  }

  // btcWithdrawal(_withdrawal) {
  //   this.withdrawalError = '';
  //   this.withdrawalSuccess = '';
  //   let that = this;
  //   let withdrawalDetails = {
  //     amount: _withdrawal.amount,
  //     token: this.withdrawalToken,
  //     verifyToken: _withdrawal.authCode
  //   }

  //   this.bbService.withdrawal(withdrawalDetails)
  //   .subscribe((res) => {
  //     if (res.hasError) {
  //       this.withdrawalError = res.message;
  //     } else {
  //       this.withdrawalSuccess = res.message;
  //       setTimeout(function() {
  //         // window.location.reload();
  //         that._windows.nativeWindow.location.reload();
  //       }, 1000);
  //     }
  //   })
  // }

  transferUserVerify(_transfer) {
    let transferDetails = {
      username: _transfer.userId
    }

    this.transferDetails = _transfer;
    this.transferIsBegan = true;
    this.transferModal.hide();
    this.bbService.transferUserVerify(transferDetails)
    .subscribe((res) => {
      this.transferIsBegan = false;
      if (res.hasError) {
        this.transferError = res.message;
      } else {
        this.veifyUser = res.user;
        this.veifyUser.amount = _transfer.amount
        this.transferSureModal.show();
      }
    })
  }

  btcTransfer(_transfer) {
    this.transferError = '';
    this.transferSuccess = '';

    let transferDetails = {
      receiver: this.transferDetails.userId,
      companyCode: this.transferDetails.product,
      total: this.transferDetails.amount
    }

    this.transferIsBegan = true;
    this.bbService.transferAmount(transferDetails)
    .subscribe((res) => {
      this.transferIsBegan = false;
      if (res.isError) {
        this.transferError = res.message;
      } else {
        this.transferSuccess = res.message;
        let that = this;
        setTimeout(function() {
          // window.location.reload();
          that._windows.nativeWindow.location.reload();
        }, 3000);
      }
    })
  }



  getTransactions(_currentPage) {
    // this.bbService.transactionsWithdrawTransfer(_currentPage)
    this.bbService.getLedgerWallets(_currentPage)
    .subscribe((res) => {
      if (res.error) {
        this.transactionMessage = res.message;
      } else {
        // this.transactions = res.transactions;
        this.transactions = res.data || [];
        this.totalTransactions = res.count;
        this.itemPerPage = 25;
        this.currentPage = res.currentPage;
        if (this.transactions.length == 0) {
          this.transactionMessage = Constants.NO_TRANSACTION_FOUND;
        }
      }
    })
  }

  public hideModal(): void {
    this.withdrawalError = '';
    this.withdrawalSuccess = '';
    this.transferError = '';
    this.transferSuccess = '';
    this.withdrawalModal.hide();
    this.transferModal.hide();
    this.transferSureModal.hide();
  }

  getOTPStatus() {
   this.bbService.getProfile()
    .subscribe((res) => {
      this.otpStatus = res.user.enable2FA;
    })
  }

  getCompanyShares() {
    this.bbService.getShares()
    .subscribe((res) => {
      this.hasShares = false;
      if(!res.error) {
        this.companiesShares = res.data || [];
        this.hasShares = (this.companiesShares.length > 0);
        this.tentanium = 0;
        this.digitex = 0;
        let len = this.companiesShares.length;
        for(let idx = 0; idx < len; idx++) {
          if(this.companiesShares[idx].companyCode === 'TENTANIUM') {
            this.tentanium = (this.companiesShares[idx].totalShares * 1);
          }
          else if(this.companiesShares[idx].companyCode === 'DIGITEX') {
            this.digitex = (this.companiesShares[idx].totalShares * 1);
          }
        }
      }
    });
  }

  getBKNsWallet() {
    this.bbService.getBKNsWallet()
    .subscribe((res) => {
      this.hasWalletBKN = false;
      this.traderWallet = [];
      this.bknValue = 0;
      if(!res.error) {
        this.traderWallet = res.data || [];
        this.hasWalletBKN = (this.companiesShares.length > 0);
        this.bvValue = 0;
        this.bknValue = 0;
        let len = this.traderWallet.length;
        for(let idx = 0; idx < len; idx++) {
          if(this.traderWallet[idx].currencyCode === 'BKN') {
            this.bknValue = this.traderWallet[idx].amount;
          }
          else if(this.traderWallet[idx].currencyCode === 'BV') {
            this.bvValue = this.traderWallet[idx].amount;
          }
        }
      }
    });
  }

  ngOnInit() {
    this.vanguard  = 0;
    this.digitex   = 0;
    this.bkn       = 0;
    this.tentanium = 0;
    this.products  = [];
    this.getCompanyShares();
    this.getBKNsWallet();
    this.veifyUser = {
      fname: '',
      lname: '',
      email: ''
    }

    // this.getBtcInfo();
    // this.getUsdInfo();
    // this.getOTPStatus();
    this.getTransactions(this.currentPage);
    // this.getProductsPurchase();
    // this.getAllProducts();
  }

}
