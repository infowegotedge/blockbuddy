import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BBService } from '../bb.service';
import { JQueryWork } from '../app.jquery';
import { WindowRef } from '../app.windows';

@Component({
  selector: 'app-signup-success',
  templateUrl: './signup-success.component.html',
  styleUrls: ['./signup-success.component.css']
})
export class SignupSuccessComponent implements OnInit {

  tokenId: string;
  serverError: string;
  successMessage: string;

  constructor(
    private bbService: BBService,
    private route: ActivatedRoute,
    private _ngZone: NgZone,
    private _exWork: JQueryWork,
    private _windows: WindowRef
  ) {
    this.tokenId = this.route.snapshot.params.token;
  }

  verifyEmail() {
    let verifyData = {
      verify_token: this.tokenId,
    }

    this.bbService.verifyEmail(verifyData)
    .subscribe(res => {
      if (res.hasError) {
        this.serverError = res.message;
        this.successMessage = null;
      } else {
        this.successMessage = res.message;
        this.serverError = null;
      }

      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this._ngZone.run(() => {
            this._windows.nativeWindow.location.href = '/#/login';
          })
        }, 10000);
      });
    })
  }

  ngOnInit() {
    if (this._exWork) {
      let hideElement = this._exWork.hideDOMElement;
    }

    this.verifyEmail();
  }

}
