import { Component, OnInit, NgZone } from '@angular/core';
// import { CookieService, CookieOptions } from 'angular2-cookie/core';
import { CookieService } from 'ngx-cookie';
import { LocalStorageService } from 'ngx-webstorage';
import { WindowRef } from '../app.windows';
import { JQueryWork } from '../app.jquery';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
  // providers: [
  //   { provide: CookieOptions, useValue: {} }
  // ]
})
export class SuccessComponent implements OnInit {

  constructor(
    private _cookieService: CookieService,
    private localStorage: LocalStorageService,
    private _ngZone: NgZone,
    private _windows: WindowRef,
    private _exWork: JQueryWork
  ) { }

  ngOnInit() {
    let signup = this._cookieService.get('signup');
    if (this.localStorage.retrieve('token')) {
      this._windows.nativeWindow.location.href = '#/dashboard';
    } else if (signup === '1') {
      if (this._exWork) {
        let hideElement = this._exWork.hideDOMElement;
      }

      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this._ngZone.run(() => {
            this._windows.nativeWindow.location.href = '/#/login';
          })
        }, 15000);
      });
    } else {
      this._windows.nativeWindow.location.href = '#/login';
    }
  }

}
