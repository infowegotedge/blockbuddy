import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../bb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Constants } from '../app.constants';
import * as moment from 'moment';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
!one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
  ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
!one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
  ? false : one.day > two.day : one.month > two.month : one.year > two.year;

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {
  public title: string = '<strong>Confirm</strong>';
  public message: string = '<strong>Are you sure</strong>, you want to perform this transaction<br/><br/>';

  private companyCode: string;
  companyFound: boolean;
  companies: any = [];
  companyIs: any;
  shares: any = [];
  index: number;
  numberRegex: string;
  decimalRegex: string;
  offersMaxSize: number;
  perPageItem: number;
  showExtraField: boolean;
  sellOffers: any = [];
  bidOffers: any = [];
  totalBidOffers: number;
  currentBidPage: number;
  totalSellOffers: number;
  currentSellPage: number;
  successMessage: string;
  errorMessage: string;
  errorSellAcceptMessage: string;
  successSellAcceptMessage: string;
  errorBidAcceptMessage: string;
  successBidAcceptMessage: string;
  regenerate: boolean;
  regenerateGraph: string;
  dateRangeSelected: string;
  wallets: any;
  displayMonths: number;
  navigation: string;
  customDateError: string;

  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;

  form: FormGroup;
  company: FormControl;

  trade: FormGroup;
  offerType: FormControl;
  numberOfShares: FormControl;
  sharePrice: FormControl;

  stats: any = {};
  liveValue: number;
  diffPercent: number;
  gainLoss: number;

  @ViewChild('customDateModal') public customDateModal: ModalDirective;
  constructor(
    private bbService: BBService,
    private route: ActivatedRoute,
    private router: Router,
    private _ngZone: NgZone,
    private calendar: NgbCalendar
  ) {
    this.companyCode = this.route.snapshot.params.companyCode;
    this.numberRegex   = Constants.NUMBER_PATTER_WITHOUT_DECIMAL;
    this.decimalRegex  = Constants.NUMBER_PATTER;
    this.offersMaxSize = Constants.MAX_PAGE_SIZE;
    this.perPageItem   = Constants.PAGINATION_SIZE;
    this.displayMonths = 2;
    this.navigation = 'select';
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  getCompanies() {
    this.bbService.getCompanies()
    .subscribe((res) => {
      this.companies = res.data || [];
    });
  }

  getCompany(companyCode) {
    this.bbService.getCompany(companyCode)
    .subscribe((res) => {
      this.companyIs = res.data || [];
      this.companyFound = true;
    });
  }

  getCompanyShares(companyCode) {
    this.shares = { totalShares: 0 };
    this.bbService.getCompanyShares(companyCode)
    .subscribe((res) => {
      let shares = res.data || [];
      if ( shares.length > 0 ) {
        this.shares = shares[0];
      }
    });
  }

  getStats(companyCode) {
    this.bbService.stockPriceGraph(companyCode)
    .subscribe((res) => {
      let defaultVal = { 'minimum': 0, 'maximum': 0, 'average': 0 };
      this.stats     = (res.data && res.data.stats && res.data.stats.length > 0 ? res.data.stats[0] : defaultVal);
      let graphData  = (res.data && res.data.report && res.data.report.rows ? res.data.report.rows : []);

      this.liveValue   = (graphData.length > 0 ? graphData[graphData.length - 1].tradeUnitPrice : 0);
      let diffPercent  = (graphData.length >= 2 ? graphData[graphData.length - 2].tradeUnitPrice : 0);
      this.diffPercent = ( ( ( this.liveValue - diffPercent ) * 100 ) / diffPercent );

      if (this.diffPercent > 0) {
        this.gainLoss = 1;
      } else if (this.diffPercent < 0) {
        this.gainLoss = 2;
        this.diffPercent = this.diffPercent * -1;
      } else {
        this.gainLoss = -1;
        this.diffPercent = 0;
      }

      diffPercent = this.diffPercent.toFixed(2);
      this.diffPercent = ( diffPercent * 1 );
    });
  }

  getWallet() {
    // Refresh On Buy Sell Offer Or Create
    this.wallets = { amount: 0 };
    this.bbService.getBKNsWallet()
    .subscribe((res) => {
      let wallets = res.data || {};
      if (wallets.length > 0) {
        for (let i = 0; i < wallets.length; i++) {
          if (wallets[i].currencyCode.toLowerCase() === 'bkn') {
            this.wallets.amount = wallets[i].amount;
          }
        }
      }
    });
  }

  beforeChange(event) {
    if (event.nextId === 'buy') {
      this.trade.controls['offerType'].setValue('bid');
    } else if (event.nextId === 'sell') {
      this.trade.controls['offerType'].setValue('sell');
    }
    this.trade.controls['numberOfShares'].setValue('0');
    this.trade.controls['sharePrice'].setValue('0');
  }

  getBidOffers(pageNumber, companyCode) {
    let page = (pageNumber || 1);

    this.bbService.getOffers(page, companyCode, 'BID')
    .subscribe((res) => {
      this.bidOffers = res.data || [];
      this.totalBidOffers = res.total;
      this.currentBidPage = pageNumber;
    });
  }

  getSellOffers(pageNumber, companyCode) {
    let page = (pageNumber || 1);

    this.bbService.getOffers(page, companyCode, 'SELL')
    .subscribe((res) => {
      this.sellOffers = res.data || [];
      this.totalSellOffers = res.total;
      this.currentSellPage = pageNumber;
    });
  }

  bidTradePost(postData, trader, type) {
    this.bbService.bidTradePost(postData)
    .subscribe((res) => {
      if (!res.isError) {
        this.getCompanyShares(this.companyCode);
        this.getWallet();
        trader.resetForm();
        this.successMessage = res.message;
        this.errorMessage   = null;
      } else {
        this.successMessage = null;
        this.errorMessage   = res.message;
      }
      this.hideMessage(type);
    });
  }

  sellTradePost(postData, trader, type) {
    this.bbService.sellTradePost(postData)
    .subscribe((res) => {
      if (!res.isError) {
        this.getCompanyShares(this.companyCode);
        this.getWallet();
        trader.resetForm();
        this.successMessage = res.message;
        this.errorMessage   = null;
      } else {
        this.successMessage = null;
        this.errorMessage   = res.message;
      }
      this.hideMessage(type);
    });
  }

  postTrade(trader) {
    if (this.trade.valid && this.trade.value.sharePrice > 0 && this.trade.value.numberOfShares > 0) {
      // Form Save Code
      let postData = {
        totalShares: this.trade.value.numberOfShares,
        unitPrice: this.trade.value.sharePrice,
        companyCode: this.companyCode
      };

      if (this.trade.value.offerType === 'bid') {
        this.bidTradePost(postData, trader, 'bid');
      } else if (this.trade.value.offerType === 'sell') {
        this.sellTradePost(postData, trader, 'sell');
      }
    } else {
      this.successMessage = null;
      this.errorMessage   = 'Coins OR Price should be greater than zero.'
    }
  }

  bidAcceptTradePost(postData) {
    this.bbService.bidAcceptTradePost(postData)
    .subscribe((res) => {
      if (!res.isError) {
        this.getCompanyShares(this.companyCode);
        this.getWallet();
        this.successBidAcceptMessage = res.message;
        this.errorBidAcceptMessage   = null;
      } else {
        this.successBidAcceptMessage = null;
        this.errorBidAcceptMessage   = res.message;
      }
      this.hideMessage(null);
    });
  }

  sellAcceptTradePost(postData) {
    this.bbService.sellAcceptTradePost(postData)
    .subscribe((res) => {
      if (!res.isError) {
        this.getCompanyShares(this.companyCode);
        this.getWallet();
        this.successSellAcceptMessage = res.message;
        this.errorSellAcceptMessage   = null;
      } else {
        this.successSellAcceptMessage = null;
        this.errorSellAcceptMessage   = res.message;
      }
      this.hideMessage(null);
    });
  }

  hideMessage(type) {
    this.getSellOffers(1, this.companyCode);
    this.getBidOffers(1, this.companyCode);

    this._ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this._ngZone.run(() => {
          this.successMessage = null;
          this.errorMessage   = null;
          this.successBidAcceptMessage = null;
          this.errorBidAcceptMessage = null;
          this.successSellAcceptMessage = null;
          this.errorSellAcceptMessage = null;
          this.generateGraph('1d');
          if (type) {
            this.trade.controls['offerType'].setValue(type);
          }
        })
      }, 2000);
    });
  }

  postAcceptTrade(offerId, buyOrSell) {
    let postData = {
      "offerID": offerId
    };

    if (buyOrSell === 'BUY') {
      this.bidAcceptTradePost(postData);
    } else if (buyOrSell === 'SELL') {
      this.sellAcceptTradePost(postData);
    }
  }

  changeRouter() {
    this.companyFound = false;
    this.index = 0;
    this.showExtraField = false;
    this.companyCode = this.companyCode.toUpperCase()
    this.getCompanies();
    this.getCompany(this.companyCode)
    this.getCompanyShares(this.companyCode);
    this.getSellOffers(1, this.companyCode);
    this.getBidOffers(1, this.companyCode);
    this.createFormControls();
    this.createForm();
    this.getWallet();
    this.getStats(this.companyCode);
    this.router.navigate(['/trade/portal/' + this.companyCode.toLowerCase()]);
  }

  generateGraph(days) {
    this.regenerate = true;
    this.regenerateGraph = days;
    this.dateRangeSelected = days;

    let maxDay = moment().toISOString();
    let minDay = null;
    let showGraph = false;

    switch (days) {
      case '1d':
        minDay = '1DAY'; // moment().subtract(1, 'days').toISOString();
        showGraph = true;
        break;
      case '2d':
        minDay = '2DAY'; // moment().subtract(2, 'days').toISOString();
        showGraph = true;
        break;
      case '3d':
        minDay = '3DAY'; // moment().subtract(3, 'days').toISOString();
        showGraph = true;
        break;
      case '1w':
        minDay = '1WEEK'; // moment().subtract(7, 'days').toISOString();
        showGraph = true;
        break;
      case '1m':
        minDay = '1MONTH'; // moment().subtract(1, 'months').toISOString();
        showGraph = true;
        break;
      case 'all':
        showGraph = true;
        minDay = 'all';
        maxDay = 'all';
        break;
      case 'custom':
        break;
    }

    if (showGraph === true) {
      if (minDay !== maxDay) {
        this.regenerateGraphComponent(minDay);
      } else {
        this.regenerateGraphComponent(null);
      }
    } else {
      this.customDateModal.show();
    }
  }

  onDateChange(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);

  customDateSubmit() {
    if (this.fromDate.day && this.toDate.day) {
      let minDay = moment(this.fromDate.day).toISOString();
      let maxDay = moment(this.toDate.day).toISOString();
      this.regenerateGraphComponent(minDay + ':' + maxDay);
      this.hideModal();
    }
  }

  regenerateGraphComponent(days) {
    this._ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this._ngZone.run(() => {
          this.regenerate = false;
          this.dateRangeSelected = days;
          this.getStats(this.companyCode);
        })
      }, 250);
    });
  }

  public hideModal(): void {
    this.customDateModal.hide();
    this.regenerateGraphComponent(null);
  }

  createFormControls() {
    this.company = new FormControl('', [
      Validators.required
    ]);

    this.offerType = new FormControl('bid', [
      Validators.required
    ]);
    this.numberOfShares = new FormControl('0', [
      Validators.required,
      Validators.pattern(this.decimalRegex)
    ]);
    this.sharePrice = new FormControl('0', [
      Validators.required,
      Validators.pattern(this.decimalRegex)
    ]);
  }

  createForm() {
    this.form = new FormGroup({
      company: this.company
    });

    this.trade = new FormGroup({
      offerType: this.offerType,
      numberOfShares: this.numberOfShares,
      sharePrice: this.sharePrice
    });
  }

  ngOnInit() {
    this.companyFound = false;
    this.regenerate = false;
    this.regenerateGraph = 'all';
    this.dateRangeSelected = '1d';
    this.index = 0;
    this.showExtraField = false;
    this.companyCode = this.companyCode.toUpperCase()
    this.getCompanies();
    this.getCompany(this.companyCode)
    this.getCompanyShares(this.companyCode);
    this.getSellOffers(1, this.companyCode);
    this.getBidOffers(1, this.companyCode);
    this.createFormControls();
    this.createForm();
    this.getWallet();
    this.getStats(this.companyCode);
  }

}
