/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Params, Router, ActivatedRoute, Data} from '@angular/router';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { BBService } from '../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PaginationModule } from 'ngx-bootstrap';
import { CookieModule, CookieService } from 'ngx-cookie';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, AuthService } from "angular4-social-login";
import { WindowRef } from '../app.windows';
import { Constants } from '../app.constants';
import { JQueryWork } from '../app.jquery';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { SignupComponent } from './signup.component';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("832021259654-l11ho5vvkskff2jns8af5453f0i6vujk.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("389672018117911")
  }
]);

export function provideConfig() {
  return config;
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockRouter = new MockRouter();

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
        PaginationModule.forRoot(),
        CookieModule.forRoot()
      ],
      providers: [
        BBService,
        WindowRef,
        LocalStorageService,
        Constants,
        CookieService,
        AuthService,
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {}
            }
          }
        },
        { provide: JQueryWork, userValue: JQueryWork },
        { provide: XHRBackend, useClass: MockBackend },
        { provide: AuthServiceConfig, useFactory: provideConfig },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {queryParams:  Observable.of({ ref: 'Stepan' }) },
            paramMap: { subscribe: function(params) {  } }
          }
        }
      ],
      declarations: [ SignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('username field validity', () => {
    let errors = {};
    let username = component.form.controls['username'];
    expect(username.valid).toBeFalsy();

    // Email field is required
    errors = username.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    username.setValue("test");
    errors = username.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('first name field validity', () => {
    let errors = {};
    let firstName = component.form.controls['firstName'];
    expect(firstName.valid).toBeFalsy();

    // Email field is required
    errors = firstName.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    firstName.setValue("test");
    errors = firstName.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('last name field validity', () => {
    let errors = {};
    let lastName = component.form.controls['lastName'];
    expect(lastName.valid).toBeFalsy();

    // Email field is required
    errors = lastName.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    lastName.setValue("test");
    errors = lastName.errors || {};
    expect(errors['required']).toBeFalsy();
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

  it('mobile field validity', () => {
    let errors = {};
    let mobile = component.form.controls['mobile'];
    expect(mobile.valid).toBeFalsy();

    // Email field is required
    errors = mobile.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    mobile.setValue("39");
    errors = mobile.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeTruthy();

    mobile.setValue("9394579000");
    errors = mobile.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeFalsy();
  });

  it('country field validity', () => {
    let errors = {};
    let country = component.form.controls['country'];
    expect(country.valid).toBeFalsy();

    // Email field is required
    errors = country.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    country.setValue("India");
    errors = country.errors || {};
    expect(errors['required']).toBeFalsy();
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
    let cpassword = component.form.controls['confirmPassword'];

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
      message: "Saved Successfully."
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.register(paramPostBody).subscribe((res) => messages = res);

    // Test Goes here
    expect(component.form.valid).toBeFalsy();
    component.sponsorId = 'bb';
    component.form.controls['username'].setValue("testname");
    component.form.controls['password'].setValue("test123");
    component.form.controls['email'].setValue("test@test.com");
    component.form.controls['firstName'].setValue("test");
    component.form.controls['lastName'].setValue("name");
    component.form.controls['country'].setValue("India");
    component.form.controls['mobile'].setValue("+911234567890");
    component.form.controls['confirmPassword'].setValue("test123");
    expect(component.form.valid).toBeTruthy();

    // Trigger the login function
    component.register();

    // Now we can check to make sure the emitted value is correct
    expect(messages.hashError).toBeFalsy();
    expect(messages.message).toBe(mockBody.message);
  }));
});
