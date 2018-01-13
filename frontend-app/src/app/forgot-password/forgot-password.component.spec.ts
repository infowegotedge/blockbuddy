/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { BBService } from '../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { WindowRef } from '../app.windows';
import { Constants } from '../app.constants';
import { JQueryWork } from '../app.jquery';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        ModalModule.forRoot(),
        ConfirmationPopoverModule.forRoot({confirmButtonType: 'danger'})
      ],
      providers: [
        BBService,
        WindowRef,
        Constants,
        LocalStorageService,
        { provide: JQueryWork, useValue: JQueryWork },
        { provide: XHRBackend, useClass: MockBackend }
      ],
      declarations: [ ForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('email field validity', () => {
    let errors = {};
    let email = component.form.controls['email'];
    expect(email.valid).toBeFalsy();

    // Email field is required
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something (wrong input)
    email.setValue("test");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();
    // Set email to something (wrong input)
    email.setValue("test@.com");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();
    // Set email to something (wrong input)
    email.setValue("@.com");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();
    // Set email to something (wrong input)
    email.setValue("@test.com");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();
    // Set email to something (wrong input)
    email.setValue("test.com");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();
    // Set email to something (wrong input)
    email.setValue("test.co.in");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    // Set email to something (correct input)
    email.setValue("test@test.com");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  });

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let messages: any;
    let paramPostBody: any;
    const mockBody = {
      hasError: false,
      message: "Password reset link has been sent to your email Id. Please check."
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.forgotPassword(paramPostBody).subscribe((res) => messages = res);

    // Test Goes here
    expect(component.form.valid).toBeFalsy();
    component.form.controls['email'].setValue("test@test.com");
    expect(component.form.valid).toBeTruthy();

    // Trigger the login function
    component.forgotPassword();

    // Now we can check to make sure the emitted value is correct
    expect(messages.hashError).toBeFalsy();
    expect(messages.message).toBe(mockBody.message);
  }));
});
