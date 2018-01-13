import { Component, OnInit, NgZone } from '@angular/core';
import { BBService } from '../bb.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Constants } from '../app.constants';
import { JQueryWork } from '../app.jquery';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  serverError: string;
  successMessage: string;
  emailPattern: string;
  form: FormGroup;
  email: FormControl;

  constructor(private bbService: BBService, private _exWork: JQueryWork, private _ngZone: NgZone) {
    this.emailPattern = Constants.EMAIL_PATTER;
  }

  forgotPassword() {
    let forgotData = {
      email: this.form.value.email
    }
    this.serverError = '';
    this.successMessage = '';
    this.bbService.forgotPassword(forgotData)
    .subscribe(res => {
      if (res.hasError) {
        this.serverError = res.message;
        this._ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this._ngZone.run(() => { this.serverError = null; });
          }, 3000);
        });
      } else {
        this.successMessage = res.message;
      }
    })
  }

  createFormControls() {
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern(this.emailPattern)
    ]);
  }

  createForm() {
    this.form = new FormGroup({
      email: this.email
    });
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    if (this._exWork) {
      let hideElement = this._exWork.hideDOMElement;
    }
  }

}
