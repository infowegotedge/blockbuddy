import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { BBService } from '../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PaginationModule } from 'ngx-bootstrap';
import { WindowRef } from '../app.windows';
import { Constants } from '../app.constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { OtpFeatureComponent } from './otp-feature.component';

describe('OtpFeatureComponent', () => {
  let component: OtpFeatureComponent;
  let fixture: ComponentFixture<OtpFeatureComponent>;

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
        { provide: FormGroup, useValue: FormGroup },
        { provide: Validators, useValue: Validators },
        { provide: FormBuilder, userValue: FormBuilder },
        { provide: FormControl, userValue: FormControl },
        { provide: XHRBackend, useClass: MockBackend }
      ],
      declarations: [ OtpFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('token field validity', () => {
    let errors = {};
    let token = component.form.controls['token'];

    // Email field is required
    errors = token.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something
    token.setValue("123");
    errors = token.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeTruthy();

    token.setValue("12343");
    errors = token.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeFalsy();
  });

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
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
    component.getOTPStatus();

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
