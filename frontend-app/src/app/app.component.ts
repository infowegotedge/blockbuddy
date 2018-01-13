import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from './bb.service';
// import { CookieService, CookieOptions } from 'angular2-cookie/core';
import { CookieService } from 'ngx-cookie';
import { WindowRef } from './app.windows';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    BBService,
    // { provide: CookieOptions, useValue: {} }
  ]
})
export class AppComponent implements OnInit {
  public user:any = {};
  public adminRole: boolean;
  overlayMessage: boolean;
  yourPassword: string;
  lockPassword: string = 'Ldmq2#^qp!';

  @ViewChild('sessionExpireModal') public sessionExpireModal: ModalDirective;
  constructor(
    private bbService: BBService,
    private _cookieService: CookieService,
    private router: Router, 
    private localStorage: LocalStorageService,
    private _windows: WindowRef, 
    private _ngZone: NgZone
  ) { }

  timeOutFunction(timestamp) {
    if(moment(timestamp).subtract(1, 'minute').toISOString() >= (new Date()).toISOString()) {
      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this._ngZone.run(() => {
            this.timeOutFunction(this.localStorage.retrieve('timestamp'));
          })
        }, 5000);
      });
    }
    else {
      this.sessionExpireModal.show();
    }
  }

  continue() {
    this.hideModal();
    this.bbService.resumeLogin()
    .subscribe((res) => {
      if(!res.hasError) {
        this.localStorage.clear('token');
        this.localStorage.clear('trade');
        this.localStorage.clear('timestamp');

        this.localStorage.store('token', res.token);
        this.localStorage.store('trade', res.tokenValue);
        this.localStorage.store('timestamp', moment().second(res.exipresIn).toISOString());
        this._cookieService.put('token', res.token, {expires: moment().second(res.exipresIn).toISOString()});
        this._windows.nativeWindow.location.reload();
      }
      else {
        this.router.navigate(['/logout']);
      }
    });
  }

  public hideModal(): void {
    this.sessionExpireModal.hide();
  }

  public closeMessage() {
    // this.overlayMessage = true;
  }

  public submitValue() {
    if ( this.lockPassword === this.yourPassword) {
      this.overlayMessage = true;
    }
  }

  ngOnInit() {
    this.adminRole = false;
    // this.overlayMessage = true;

    if ( !this.localStorage.retrieve('token') ) {
      this.localStorage.clear('role');
    }

    if ( this.localStorage.retrieve('role') === 'admin' ) {
      this.adminRole = true;
    }

    if(this.localStorage.retrieve('timestamp') > (new Date()).toISOString()) {
      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this._ngZone.run(() => {
            this.timeOutFunction(this.localStorage.retrieve('timestamp'));
          })
        }, 1000);
      });
    }
  }
}
