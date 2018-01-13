import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BBService } from '../bb.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Constants } from '../app.constants';
import { JQueryWork } from '../app.jquery';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  user: any = {};
  serverError: string;
  successMessage: string;
  isConfirmPassError: boolean;
  tokenId: string;
  passwordPattern: string;
  form: FormGroup;
  confirmpassword: FormControl;
  password: FormControl;

  constructor(private bbService: BBService, private route: ActivatedRoute, private _exWork: JQueryWork) {
    this.tokenId = this.route.snapshot.params.token;
    this.passwordPattern = Constants.PASSWORD_PATTER;
  }

  validatePassword() {
    let that = this;
    setTimeout(function() {
      let pass = that.form.value.password;
      let confirmPass = that.form.value.confirmpassword;

      if (pass === confirmPass) {
        that.isConfirmPassError = false;
      } else {
        that.isConfirmPassError = true;
      }
      return that.isConfirmPassError;
    }, 50)
  }

  resetPassword() {
    let resetData = {
      token: this.tokenId,
      password: this.form.value.password,
      confirmpassword: this.form.value.confirmpassword
    }

    this.bbService.resetPassword(resetData)
    .subscribe(res => {
      if (res.hasError) {
        this.serverError = res.message;
      } else {
        this.successMessage = res.message;
      }
    })

  }

  createFormControls() {

    this.confirmpassword = new FormControl('', [
      Validators.required
    ]);

    this.password = new FormControl('', [
      Validators.required,
      Validators.pattern(this.passwordPattern),
      Validators.minLength(6)
    ]);
  }

  createForm() {
    this.form = new FormGroup({
      confirmpassword: this.confirmpassword,
      password: this.password
    });
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    if (this._exWork) {
      let hideElement = this._exWork.hideDOMElement;
    }

    // jQuery(".page-body").addClass('login-page login-light');
    // jQuery(".app-top-header").addClass('hidden');
    // jQuery(".sidebar-menu").addClass('hidden');
    // jQuery("app-header").addClass('hidden');
    // jQuery("footer").addClass('hidden');
  }

}
