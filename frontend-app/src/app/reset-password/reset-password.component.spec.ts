import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Params, Router, ActivatedRoute} from '@angular/router';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { BBService } from '../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PaginationModule } from 'ngx-bootstrap';
import { WindowRef } from '../app.windows';
import { Constants } from '../app.constants';
import { JQueryWork } from '../app.jquery';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        ModalModule.forRoot(),
        ConfirmationPopoverModule.forRoot({
          confirmButtonType: 'danger' // set defaults here
        }),
        PaginationModule.forRoot()
      ],
      providers: [
        BBService,
        WindowRef,
        LocalStorageService,
        Constants, 
        { provide: ActivatedRoute, useValue: {
          snapshot: {
            params: {token: "sdfasfdads-asdfas-asdfasf-sadfasf-asdfasdfsdfs"}
          }
        }},
        { provide: JQueryWork, useValue: JQueryWork },
        { provide: FormGroup, useValue: FormGroup },
        { provide: Validators, useValue: Validators },
        { provide: FormBuilder, userValue: FormBuilder },
        { provide: FormControl, userValue: FormControl },
        { provide: XHRBackend, useClass: MockBackend }
      ],
      declarations: [ ResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('password field validity', () => {
    let errors = {};
    let password = component.form.controls['password'];

    // Email field is required
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    password.setValue("asdf");
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();
    expect(errors['minlength']).toBeTruthy();

    password.setValue("123343");
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();
    expect(errors['minlength']).toBeFalsy();

    password.setValue("ravi4323");
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
    expect(errors['minlength']).toBeFalsy();
  });

  it('confirm password field validity', () => {
    let errors = {};
    let cpassword = component.form.controls['confirmpassword'];

    // Email field is required
    errors = cpassword.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    cpassword.setValue("ravi4323");
    errors = cpassword.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let messages: any;
    let paramPostBody: any;
    const mockBody = {
      hasError: false,
      message: "Password changed successfully."
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.resetPassword(paramPostBody).subscribe((res) => messages = res);

    // Test Goes here
    expect(component.form.valid).toBeFalsy();
    component.form.controls['password'].setValue("test123");
    component.form.controls['confirmpassword'].setValue("test123");
    expect(component.form.valid).toBeTruthy();

    // Trigger the login function
    component.resetPassword();

    // Now we can check to make sure the emitted value is correct
    expect(messages.hashError).toBeFalsy();
    expect(messages.message).toBe(mockBody.message);
  }));
});
