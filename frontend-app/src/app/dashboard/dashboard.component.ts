import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { WindowRef } from '../app.windows';
import { Constants } from '../app.constants';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  users: any = 0;
  totalUsers = 0;
  latestSignups: any = [];
  adminRole: boolean;
  chart: AmChart;
  countryFlag: string;
  showSection: boolean = true;
  withdrawals: any = [];
  dateService: any;
  username: string;
  totalMyDirects: number;
  totalMyUser: number;
  totalPurchase: number;
  affiliateUrl: string;
  topAffiliateUsers: any;
  topAffiliateUsersMessage: string;
  affiliateEarning: number;
  commissions: any = [];
  enable1: boolean;
  message: boolean;
  hideContent: boolean;
  copyButtonText: string = 'COPY';
  notifications: string;
  notificationMessage: boolean;
  totalDirectsWeek: number;
  affiliateVisitLastCount: number;
  affiliateVisit: number;
  withdrawalsMessages: string;
  commissionsMessages: string;
  totalMyUserLastCount: string;
  profileMessage: boolean;
  toggleIcon: boolean;
  companiesShares: any;
  traderWallet: any;
  tentanium: number;
  digitex: number;
  vanguard: number;
  bknValue: number;
  bvValue: number;
  totalUnread: number;
  hasWalletBKN: boolean;
  cmsContent: any;
  mainCMSContent: any;
  gainLoss: any = {};
  productPurchase: number;
  user: any = {};

  @ViewChild('profileNotificationModal') public profileNotificationModal:ModalDirective;
  constructor(
    private bbService: BBService, 
    private localStorage: LocalStorageService, 
    private _windows: WindowRef, 
    private _ngZone: NgZone,
    private AmCharts: AmChartsService,
    private router: Router
  ) {
    this.dateService  = new Date();
    this.affiliateUrl = Constants.AFFILIATE_URL;
  }

  toggleIconClick() {
    this.toggleIcon = !this.toggleIcon;
  }

  getLatestSignups() {
    return this.bbService.getLatestSignups()
      .subscribe((res) => {
        this.latestSignups = res.latestSignup;
        this.totalUsers = res.totalUsers;
        this.getCountryFlag();
      })
  }

  getCountryFlag() {
    this.bbService.countryFlag()
    .subscribe((_res) => {
      this.countryFlag = _res;
      for (let i = 0; i < this.latestSignups.length; i++) {
        let countryName = this.latestSignups[i].country;
        if (this.countryFlag[countryName]) {
          this.latestSignups[i].flagUrl = 'assets/images/flags/' +
          this.countryFlag[countryName].toLowerCase() + '_16.png';
        }
      }
    })
  }

  getProfile() {
    if (this.localStorage.retrieve('userid')) {
      this.username = this.localStorage.retrieve('userid');
      if (this.localStorage.retrieve('updateProfile') == false && !this.adminRole) {
        this.profileNotificationModal.show();
      }
    }
  }

  goToProfile() {
    this.hideModal();
    this.router.navigate(['/profile']);
  }

  public hideModal(): void {
    this.profileNotificationModal.hide();
  }

  getWithdrawalPending() {
    this.bbService.listWithdrawals()
    .subscribe((res) => {
      this.withdrawals = res.withdrawals;
      if(res.withdrawals.length == 0) {
        this.withdrawalsMessages = Constants.NO_TRANSACTION_FOUND;
      }
    });
  }

  getAdminWithdrawalPending() {
    this.bbService.listAdminWithdrawals()
    .subscribe((res) => {
      this.withdrawals = res.withdrawals;
    });
  }

  totalMyUsers() {
    this.bbService.totalMyUsers()
    .subscribe((res) => {
      this.totalMyDirects   = res.directs;
      this.totalDirectsWeek = res.directsThisWeek
      this.totalMyUser      = res.affiliateSignup;
      this.totalMyUserLastCount = res.affiliateSignupLastCount;
      this.totalPurchase    = res.purchase
      this.affiliateEarning = res.affiliateEarning;
      this.affiliateVisitLastCount = res.affiliateVisitLastCount;
      this.affiliateVisit = res.affiliateVisit;
    });
  }

  copyToClipboard(event) {
    let copyContent = document.querySelector('.referral-userlink');
    let range = document.createRange(); 
    range.selectNode(copyContent);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    this.copyButtonText = 'COPIED';
    this._ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this._ngZone.run(() => {
          this.copyButtonText = 'COPY';
        })
      }, 2000);
    });
  }

  // topAffiliates() {
  //   this.bbService.topAffiliates()
  //   .subscribe((res) => {
  //     this.topAffiliateUsers = res.affiliates;
  //   });
  // }

  myAffiliates() {
    this.topAffiliateUsersMessage = '';
    this.bbService.myAffiliates()
    .subscribe((res) => {
      if (!res.hasError) {
        this.topAffiliateUsers = res.myAffiliate;
        if (this.topAffiliateUsers.length === 0) {
          this.topAffiliateUsersMessage = 'No affiliate has found';
        }
      } else {
        this.topAffiliateUsersMessage = res.message;
      }
    })
  }

  // Get Inbox Message
  getInboxMessage() {
    this.totalUnread = 0;
    this.bbService.inboxHeaderMessage(1)
    .subscribe((res) => {
      if (!res.hasError) {
        this.totalUnread  = res.totalUnread;
      }
    })
  }

  listCommission() {
    this.bbService.listCommissions()
    .subscribe((_res) => {
      if(!_res.hasError) {
        this.commissions = _res.commissions;

        if (_res.commissions.length == 0) {
          this.commissionsMessages = Constants.NO_COMMISSION_FOUND;
        }
      } else {
        this.message = true;
        this.commissionsMessages = Constants.NO_COMMISSION_FOUND;
      }
    })
  }

  _getMinMax(mapData) {
    let min = 0, max = 0;
    for (var i = 0; i < mapData.length; i++) {
      var value = mapData[i].value;
      if (value < min) {
        min = value;
      }
      if (value > max) {
        max = value;
      }
    }
    return [min, max];
  }

  globalChart() {
    this.bbService.getWordMapData()
    .subscribe((_res) => {

      let targetSVG     = _res.targetSVG;
      let latlong       = _res.latlong;
      let mapData       = _res.mapData;
      let minBulletSize = _res.minBulletSize;
      let maxBulletSize = _res.maxBulletSize;
      let dataProvider  = {
        'map': "worldLow",
        'images': _res.images,
        'selectable': true
      };

      this.bbService.countryFlag()
      .subscribe((_res1) => {

        this.bbService.countryWiseUsers()
        .subscribe((_res2) => {
          let userCountry  = [];
          let countryUsers = _res2.countryUsers;

          for(let idx in countryUsers) {
            if (_res1[countryUsers[idx]._id]) {
              userCountry.push({
                "country": _res1[countryUsers[idx]._id],
                "total": countryUsers[idx].total
              });
            }
          }

          for (let idx in userCountry) {
            for(let idx1 in mapData) {
              if (mapData[idx1].code == userCountry[idx].country) {
                mapData[idx1].value = userCountry[idx].total;
              }
            }
          }

          let minMax    = this._getMinMax(mapData);
          let maxSquare = maxBulletSize * maxBulletSize * 2 * Math.PI;
          let minSquare = minBulletSize * minBulletSize * 2 * Math.PI;
    
          for (let i = 0; i < mapData.length; i++) {
            let dataItem = mapData[i];
            let value    = dataItem.value;
            // calculate size of a bubble
            let size = (value - minMax[0]) / (minMax[1] - minMax[0]) * (maxBulletSize - minBulletSize) + minBulletSize;
            if (size < minBulletSize) {
                size = minBulletSize;
            }
            if (isNaN(size)) {
              size = 0;
            }
    
            let id = dataItem.code;
            dataProvider.images.push({
              type: "circle",
              width: size,
              height: size,
              color: dataItem.color,
              longitude: latlong[id].longitude,
              latitude: latlong[id].latitude,
              title: dataItem.name,
              value: value
            });
          }
    
          for(let i = 0; i < dataProvider.images.length; i++) {
            dataProvider.images[i].svgPath = targetSVG;
          }
      
          this.chart = this.AmCharts.makeChart("global-chart", {
            "type": "map",
            "theme": "light",
            "responsive": {
              "enabled": true
            },
            "imagesSettings": {
              "rollOverColor": "#089282",
              "rollOverScale": 3,
              "selectedScale": 3,
              "selectedColor": "#089282",
              "color": "#13564e"
            },
            "areasSettings": { "unlistedAreasColor": "#15A892" },
            "dataProvider": dataProvider
          });
        });
      });
    });
  }

  getNotifications() {
    this.bbService.listNotifications()
    .subscribe((_res) => {
      if(!_res.hasError) {
        this.notifications = _res.notification;
      }
      else {
        this.notificationMessage = true;
      }
    })
  }

  getCompanyShares() {
    this.bbService.getShares()
    .subscribe((res) => {
      if(!res.error) {
        this.companiesShares = res.data || [];
        this.tentanium = 0;
        this.digitex = 0;
        let len = this.companiesShares.length;
        let gainLoss = [];
        this.gainLoss = {
          'TENTANIUM': { diff: 0, gainLoss: 0, 'liveValue': 0 },
          'DIGITEX': { diff: 0, gainLoss: 0, 'liveValue': 0 },
          'VANGUARD': { diff: 0, gainLoss: 0, 'liveValue': 0 }
        };
        for(let idx = 0; idx < len; idx++) {
          if(this.companiesShares[idx].record.companyCode === 'TENTANIUM') {
            this.tentanium = (this.companiesShares[idx].record.totalShares * 1);
            this.gainLoss['TENTANIUM'] = { diff: 0, gainLoss: 0 };
            gainLoss.push(this.getStats(this.companiesShares[idx].record.companyCode));
          } else if(this.companiesShares[idx].record.companyCode === 'DIGITEX') {
            this.digitex = (this.companiesShares[idx].record.totalShares * 1);
            this.gainLoss['DIGITEX'] = { diff: 0, gainLoss: 0 };
            gainLoss.push(this.getStats(this.companiesShares[idx].record.companyCode));
          } else if(this.companiesShares[idx].record.companyCode === 'VANGUARD') {
            this.vanguard = (this.companiesShares[idx].record.totalShares * 1);
            this.gainLoss['VANGUARD'] = { diff: 0, gainLoss: 0 };
            gainLoss.push(this.getStats(this.companiesShares[idx].record.companyCode));
          }
        }
      }
    });
  }

  getStats(companyCode) {
    this.bbService.stockPriceGraphExchangeData(companyCode)
    .subscribe((res) => {
      let graphData = (res.data ? res.data : []);
      let gainLoss  = 0;

      let liveValue   = (graphData.length > 0 ? graphData[graphData.length - 1].unitPrice : 0);
      let diffPercent = (graphData.length >= 2 ? graphData[graphData.length - 2].unitPrice : 0);
          diffPercent = ( diffPercent > 0 ? ( ( ( liveValue - diffPercent ) * 100 ) / diffPercent ) : 0);

      if (diffPercent > 0) {
        gainLoss = 1;
      } else if (diffPercent < 0) {
        gainLoss = 2;
        diffPercent = diffPercent * -1;
      } else {
        gainLoss = -1;
        diffPercent = 0;
      }

      this.gainLoss[companyCode] = { 'diff': (diffPercent.toFixed(2) * 1), 'gainLoss': gainLoss, 'liveValue': liveValue }
    });
  }

  getBKNsWallet() {
    this.bbService.getBKNsWallet()
    .subscribe((res) => {
      this.traderWallet = [];
      this.bknValue = 0;
      if(!res.error) {
        this.traderWallet = res.data || [];
        // this.hasWalletBKN = (this.companiesShares.length > 0);
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

  listCMSContent() {
    this.bbService.listUserCMSContent()
    .subscribe((res) => {
      if (!res.error) {
        this.cmsContent = [];
        let cmsContent = res.cmsContent;
        this.mainCMSContent = cmsContent[0];
        for (let i = 0; i < cmsContent.length; i++) {
          if (i != 0) {
            this.cmsContent.push(cmsContent[i]);
          }
        }
      }
    });
  }

  getPurchaseCurrentMonth() {
    this.bbService.getPurchaseCurrentMonth()
    .subscribe((res) => {
      if (!res.hasError) {
        this.productPurchase = res.payments;
      }
    });
  }

  getProfileName() {
    this.bbService.getProfile()
    .subscribe((res) => {
      this.user = res.user;
    })
  }

  ngOnInit() {
    let role = this.localStorage.retrieve('role');
    let xrole = this.localStorage.retrieve('xrole');

    if(xrole) {
      role = xrole;
    }

    this.gainLoss = {
      'TENTANIUM': { diff: 0, gainLoss: 0 },
      'DIGITEX': { diff: 0, gainLoss: 0 },
      'VANGUARD': { diff: 0, gainLoss: 0 }
    };

    this.tentanium = 0;
    this.digitex = 0;
    this.bvValue = 0;
    this.bknValue = 0;
    this.adminRole = false;
    this.enable1 = false;
    this.topAffiliateUsers = [];
    this.username = null;
    this.message = false;
    this.hideContent = true;
    this.toggleIcon = false;
    this.mainCMSContent = {};

    if ( role === 'admin' || role === 'moderator' || role === 'supervisor' ) {
      this.adminRole = true;
    }

    if (this.localStorage.retrieve('userid')) {
      this.username = this.localStorage.retrieve('userid');
      this.getCompanyShares();
      this.getBKNsWallet();
      this.getPurchaseCurrentMonth();
      this.getProfileName();
    }

    if (this.localStorage.retrieve('refreshPage')) {
      this.localStorage.clear('refreshPage');
      this._windows.nativeWindow.location.reload();
    } else {
      this.hideContent = false;
      this.totalMyUsers();
      this.getLatestSignups();
      // this.topAffiliates();
      this.myAffiliates();
      this.listCommission();
      this.getInboxMessage();
      this.listCMSContent();
      this.showSection = false;

      if(this.adminRole) {
        this.getAdminWithdrawalPending();
        this.globalChart();
        this.getNotifications();
      } else {
        this.getWithdrawalPending();
      }
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }
}
