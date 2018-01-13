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
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PaginationModule } from 'ngx-bootstrap';
import { FileUploaderModule } from "ng4-file-upload/file-uploader.module";
import { WindowRef } from '../app.windows';
import { Constants } from '../app.constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { ProfileComponent } from './profile.component';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
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
        FileUploaderModule
      ],
      providers: [
        BBService,
        WindowRef,
        LocalStorageService,
        Constants,
        { provide: Router, useValue: mockRouter },
        { provide: FormGroup, useValue: FormGroup },
        { provide: Validators, useValue: Validators },
        { provide: FormBuilder, useValue: FormBuilder },
        { provide: FormControl, useValue: FormControl },
        { provide: XHRBackend, useClass: MockBackend }
      ],
      declarations: [ ProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
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

  it('fname field validity', () => {
    let errors = {};
    let fname = component.form.controls['fname'];
    expect(fname.valid).toBeFalsy();

    // Email field is required
    errors = fname.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    fname.setValue("test");
    errors = fname.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('lname field validity', () => {
    let errors = {};
    let lname = component.form.controls['lname'];
    expect(lname.valid).toBeFalsy();

    // Email field is required
    errors = lname.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    lname.setValue("test");
    errors = lname.errors || {};
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
    mobile.setValue("123");
    errors = mobile.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeTruthy();

    // Set mobile to truthy
    mobile.setValue("8934723497");
    errors = mobile.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeFalsy();
  });

  it('btcaddress field validity', () => {
    let errors = {};
    let btcaddress = component.addressForm.controls['btcaddress'];
    expect(btcaddress.valid).toBeFalsy();

    // Email field is required
    errors = btcaddress.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set btcaddress to something
    btcaddress.setValue("1A56svALNtXPrXGt3fvwUVQPhnsUGAe1EN");
    errors = btcaddress.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let messages: any;
    let paramPostBody: any;
    const mockBody = {
      hasError: false,
      message: "BTC address is created/updated successfully."
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.createBtcAddress(paramPostBody).subscribe((res) => messages = res);
    service.updateWallet(paramPostBody).subscribe((res) => messages = res);

    // Test Goes here
    expect(component.addressForm.valid).toBeFalsy();
    component.addressForm.controls['btcaddress'].setValue("1A56svALNtXPrXGt3fvwUVQPhnsUGAe1OZ");
    expect(component.addressForm.valid).toBeTruthy();

    // Trigger the login function
    component.updateWallet();

    // Now we can check to make sure the emitted value is correct
    expect(messages.hashError).toBeFalsy();
    expect(messages.message).toBe(mockBody.message);


    // Update Test
    component.addressForm.controls['btcaddress'].setValue("1A56svALNtXPrXGt3fvwUVQPhnsUGAe1OQ");
    expect(component.addressForm.valid).toBeTruthy();

    // Trigger the login function
    component.updateWallet();

    // Now we can check to make sure the emitted value is correct
    expect(messages.hashError).toBeFalsy();
    expect(messages.message).toBe(mockBody.message);
  }));

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let messages: any;
    let paramPostBody: any;
    const mockBody = {
      hasError: false,
      message: "User update"
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.updateProfile(paramPostBody).subscribe((res) => messages = res);

    // Test Goes here
    expect(component.form.valid).toBeFalsy();
    component.form.controls['username'].setValue("testabc123");
    component.form.controls['fname'].setValue("test");
    component.form.controls['lname'].setValue("test");
    component.form.controls['postal'].setValue("208001");
    component.form.controls['email'].setValue("test@test.com");
    component.form.controls['mobile'].setValue("+911234567890");
    component.form.controls['country'].setValue("India");
    component.form.controls['state'].setValue("Delhi");
    component.form.controls['city'].setValue("Delhi");
    component.form.controls['address'].setValue("The Mall");
    expect(component.form.valid).toBeTruthy();

    // Trigger the login function
    component.updateProfile();

    // Now we can check to make sure the emitted value is correct
    expect(messages.hashError).toBeFalsy();
    expect(messages.message).toBe(mockBody.message);
  }));

  it('submitting a service ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let btcAddress: any;
    const mockBody     = {
      hasError: false,
      btcAddress: "1A56svALNtXPrXGt3fvwUVQPhnsUGAe1EQ",
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.btcAddress().subscribe((res) => btcAddress = res);

    // Trigger the login function
    component.getBtcAddress();

    // Now we can check to make sure the emitted value is correct
    expect(btcAddress.hasError).toBe(false);
    expect(btcAddress.btcAddress).toBe(mockBody.btcAddress);
  }));

  it('submitting a service ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let profile: any;
    let country: any;
    const mockBody = {
      hasError: false,
      user: {
        avatar: "", first_name: "ravi89", last_name: "mehrotra89",
        name: "ravi89 mehrotra89", email: "ravi89@allies.co.in",
        username: "ravimehrotra89", mobile: "+911234567890",
        country: "india", sponsorUsername: "ravimehrotra",
        sponsorName: "ravi mehrotra", address: "The Mall",
        city: "Kanpur", state: "UP", postal: "208001", enable2FA: false
      }
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getProfile().subscribe((res) => profile = res);

    // Trigger the login function
    component.getProfile();

    // Now we can check to make sure the emitted value is correct
    expect(profile.hasError).toBe(false);
    expect(profile.user.avatar).toBe("");
    expect(profile.user.first_name).toBe("ravi89");
    expect(profile.user.last_name).toBe("mehrotra89");
    expect(profile.user.name).toBe("ravi89 mehrotra89");
    expect(profile.user.email).toBe("ravi89@allies.co.in");
    expect(profile.user.username).toBe("ravimehrotra89");
    expect(profile.user.mobile).toBe("+911234567890");
    expect(profile.user.country).toBe("india");
    expect(profile.user.sponsorUsername).toBe("ravimehrotra");
    expect(profile.user.sponsorName).toBe("ravi mehrotra");
    expect(profile.user.address).toBe("The Mall");
    expect(profile.user.city).toBe("Kanpur");
    expect(profile.user.state).toBe("UP");
    expect(profile.user.postal).toBe("208001");
    expect(profile.user.enable2FA).toBe(false);
  }));
});
