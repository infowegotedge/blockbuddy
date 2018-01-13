import { Component, OnInit, NgZone } from '@angular/core';
import { BBService } from '../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Constants } from '../app.constants';

@Component({
  selector: 'app-my-statics',
  templateUrl: './my-statics.component.html',
  styleUrls: ['./my-statics.component.css']
})
export class MyStaticsComponent implements OnInit {

  private btcInfo:any = {};
  totalMyDirects: number;
  totalMyUser: number;
  totalPurchase: number;
  affiliateEarning: number;
  username: string;
  affiliateUrl: string;
  closeMeContent: boolean;
  hideContent: boolean;
  copyButtonText: string = 'COPY';

  constructor(private bbService: BBService, private _ngZone: NgZone, private localStorage: LocalStorageService) {
    this.affiliateUrl = Constants.AFFILIATE_URL;
  }

  totalMyUsers() {
    this.bbService.totalMyUsers()
    .subscribe((res) => {
      this.totalMyDirects   = res.directs;
      this.totalMyUser      = res.affiliateSignup;
      this.totalPurchase    = res.purchase;
      this.affiliateEarning = res.affiliateEarning;
    });
  }

  getBtcInfo() {
    this.bbService.btcInfo()
    .subscribe((res) => {
      if (!res.hasError) {
        this.btcInfo = res.btcWallet;
      }
    })
  }

  hideMe() {
    if (!this.hideContent) {
      this.hideContent = true;
      this.localStorage.store('my-statistic', '1')
    } else if ( this.hideContent || this.localStorage.retrieve('my-statistic') === '1') {
      this.hideContent = false;
      this.localStorage.clear('my-statistic');
    }
  }

  closeMe() {
    this.closeMeContent = true;
    this.localStorage.store('my-statistic', '2');
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

  getProfile() {
    if (this.localStorage.retrieve('userid')) {
      this.username = this.localStorage.retrieve('userid');
    }
  }

  ngOnInit() {
    this.totalMyUsers();
    this.getBtcInfo();
    if (this.localStorage.retrieve('userid')) {
      this.username = this.localStorage.retrieve('userid');
    }
    this.hideContent = false;
    this.closeMeContent = false;

    if (this.localStorage.retrieve('my-statistic') === '1') {
      this.hideContent = true;
    }

    if (this.localStorage.retrieve('my-statistic') === '2') {
      this.closeMeContent = true;
    }
  }
}
