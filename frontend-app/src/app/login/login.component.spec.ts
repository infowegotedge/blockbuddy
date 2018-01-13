/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { BBService } from '../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { WindowRef } from '../app.windows';
import { Constants } from '../app.constants';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, AuthService } from "angular4-social-login";
import { CookieModule, CookieService } from 'ngx-cookie';
import { JQueryWork } from '../app.jquery';
import * as moment from 'moment';

import { LoginComponent } from './login.component';

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

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter = new MockRouter();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        ModalModule.forRoot(),
        ConfirmationPopoverModule.forRoot({confirmButtonType: 'danger'}),
        CookieModule.forRoot()
      ],
      providers: [
        BBService,
        WindowRef,
        Constants,
        LocalStorageService,
        moment,
        CookieService,
        AuthService,
        { provide: Router, useValue: mockRouter },
        { provide: JQueryWork, useValue: JQueryWork },
        { provide: FormGroup, useValue: FormGroup },
        { provide: Validators, useValue: Validators },
        { provide: FormBuilder, userValue: FormBuilder },
        { provide: FormControl, userValue: FormControl },
        { provide: XHRBackend, useClass: MockBackend },
        { provide: AuthServiceConfig, useFactory: provideConfig }
      ],
      declarations: [ LoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
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

  it('password field validity', () => {
    let errors = {};
    let password = component.form.controls['password'];

    // Email field is required
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    password.setValue("123456");
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let users: any;
    let paramUsername: any;
    let paramPassword: any;
    const mockBody = {
      hasError: false,
      token: "asdfasdf-asdfasf-sadfsaf-24234o2jsdf2",
      role: 'user',
      exipresIn: 3600
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.login(paramUsername, paramPassword).subscribe((res) => users = res);

    // Test Goes here
    expect(component.form.valid).toBeFalsy();
    component.form.controls['username'].setValue("test");
    component.form.controls['password'].setValue("test123");
    expect(component.form.valid).toBeTruthy();

    // Trigger the login function
    component.login();

    // Now we can check to make sure the emitted value is correct
    expect(users.hashError).toBeFalsy();
    expect(users.token).toBe(mockBody.token);
    expect(users.role).toBe(mockBody.role);
    expect(users.exipresIn).toBe(mockBody.exipresIn);
  }));
});
