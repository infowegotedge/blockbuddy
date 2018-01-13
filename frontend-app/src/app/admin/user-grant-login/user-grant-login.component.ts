import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { ActivatedRoute } from '@angular/router';
import { BBService } from '../../bb.service';
// import { CookieService, CookieOptions } from 'angular2-cookie/core';
import { CookieService } from 'ngx-cookie';
import { WindowRef } from '../../app.windows';

@Component({
  selector: 'app-user-grant-login',
  templateUrl: './user-grant-login.component.html',
  styleUrls: ['./user-grant-login.component.css'],
  providers: [
    BBService,
    // { provide: CookieOptions, useValue: {} }
  ]
})
export class UserGrantLoginComponent implements OnInit {

  useCase: boolean;
  username: string;
  isError: boolean = false;
  serverError: string;

  constructor(
    private bbService: BBService,
    private route: ActivatedRoute,
    private _cookieService: CookieService,
    private localStorage: LocalStorageService,
    private _windows: WindowRef
  ) {
    this.username = this.route.snapshot.params.username;
    this.useCase  = (this.route.snapshot.params.uc || false);
  }

  storeAndRedirect(_resData) {
    // localStorage.setItem('exto', _resData.token);
    // localStorage.setItem('refreshPage', '1');
    this.localStorage.store('exto', _resData.token);
    this.localStorage.store('refreshPage', '1');
    this.localStorage.store('xrole', _resData.role);
    this.localStorage.store('xtrade', _resData.tokenValue);
    // window.location.href = '#/dashboard';
    this._windows.nativeWindow.location.href = '#/dashboard';
  }

  loginAsUser() {
    this.bbService.loginAsUser({username: this.username})
      .subscribe(res => {
        if (res.hasError) {
          this.isError = true;
          this.serverError = res.message;
        } else if (this.useCase === false) {
          this.storeAndRedirect(res);
        }
    });
  }

  ngOnInit() {
    this.loginAsUser();
  }

}
