import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { BBService } from '../../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PaginationModule } from 'ngx-bootstrap';
import { WindowRef } from '../../app.windows';
import { Constants } from '../../app.constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

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
      declarations: [ SettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('transferPerUserDayLimit field validity', () => {
    let errors = {};
    let transferPerUserDayLimit = component.form.controls['transferPerUserDayLimit'];

    // Set withdrawalMaxLimit to something (wrong input)
    transferPerUserDayLimit.setValue("test");
    errors = transferPerUserDayLimit.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set transferPerUserDayLimit to something (wrong input)
    transferPerUserDayLimit.setValue("10.0.123");
    errors = transferPerUserDayLimit.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set transferPerUserDayLimit to something (wrong input)
    transferPerUserDayLimit.setValue("0.123");
    errors = transferPerUserDayLimit.errors || {};
    expect(errors['pattern']).toBeFalsy();
  });

  it('withdrawalMaxLimit field validity', () => {
    let errors = {};
    let withdrawalMaxLimit = component.form.controls['withdrawalMaxLimit'];

    // Set withdrawalMaxLimit to something (wrong input)
    withdrawalMaxLimit.setValue("test");
    errors = withdrawalMaxLimit.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set withdrawalMaxLimit to something (wrong input)
    withdrawalMaxLimit.setValue("10.0.123");
    errors = withdrawalMaxLimit.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set withdrawalMaxLimit to something (wrong input)
    withdrawalMaxLimit.setValue("0.123");
    errors = withdrawalMaxLimit.errors || {};
    expect(errors['pattern']).toBeFalsy();
  });

  it('withdrawalMinLimit field validity', () => {
    let errors = {};
    let withdrawalMinLimit = component.form.controls['withdrawalMinLimit'];

    // Set withdrawalAutoLimit to something (wrong input)
    withdrawalMinLimit.setValue("test");
    errors = withdrawalMinLimit.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set withdrawalMinLimit to something (wrong input)
    withdrawalMinLimit.setValue("10.0.123");
    errors = withdrawalMinLimit.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set withdrawalMinLimit to something (wrong input)
    withdrawalMinLimit.setValue("0.123");
    errors = withdrawalMinLimit.errors || {};
    expect(errors['pattern']).toBeFalsy();
  });

  it('withdrawalAutoLimit field validity', () => {
    let errors = {};
    let withdrawalAutoLimit = component.form.controls['withdrawalAutoLimit'];

    // Set withdrawalAutoLimit to something (wrong input)
    withdrawalAutoLimit.setValue("test");
    errors = withdrawalAutoLimit.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set withdrawalAutoLimit to something (wrong input)
    withdrawalAutoLimit.setValue("10.0.123");
    errors = withdrawalAutoLimit.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set withdrawalAutoLimit to something (wrong input)
    withdrawalAutoLimit.setValue("0.123");
    errors = withdrawalAutoLimit.errors || {};
    expect(errors['pattern']).toBeFalsy();
  });

  it('transferFee field validity', () => {
    let errors = {};
    let transferFee = component.form.controls['transferFee'];

    // Set transferFee to something (wrong input)
    transferFee.setValue("test");
    errors = transferFee.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set transferFee to something (wrong input)
    transferFee.setValue("10.0.123");
    errors = transferFee.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set transferFee to something (wrong input)
    transferFee.setValue("0.123");
    errors = transferFee.errors || {};
    expect(errors['pattern']).toBeFalsy();
  });

  it('withdrawalFee field validity', () => {
    let errors = {};
    let withdrawalFee = component.form.controls['withdrawalFee'];

    // Set withdrawalFee to something (wrong input)
    withdrawalFee.setValue("test");
    errors = withdrawalFee.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set withdrawalFee to something (wrong input)
    withdrawalFee.setValue("10.0.123");
    errors = withdrawalFee.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set withdrawalFee to something (wrong input)
    withdrawalFee.setValue("0.123");
    errors = withdrawalFee.errors || {};
    expect(errors['pattern']).toBeFalsy();
  });

  it('affiliationAmount field validity', () => {
    let errors = {};
    let affiliationAmount = component.form.controls['affiliationAmount'];

    // Set affiliationAmount to something (wrong input)
    affiliationAmount.setValue("test");
    errors = affiliationAmount.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set affiliationAmount to something (wrong input)
    affiliationAmount.setValue("10.0.123");
    errors = affiliationAmount.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set affiliationAmount to something (wrong input)
    affiliationAmount.setValue("0.123");
    errors = affiliationAmount.errors || {};
    expect(errors['pattern']).toBeFalsy();
  });

  it('affiliationFee field validity', () => {
    let errors = {};
    let affiliationFee = component.form.controls['affiliationFee'];

    // Set affiliationFee to something (wrong input)
    affiliationFee.setValue("test");
    errors = affiliationFee.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set affiliationFee to something (wrong input)
    affiliationFee.setValue("10.0.123");
    errors = affiliationFee.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set affiliationFee to something (wrong input)
    affiliationFee.setValue("0.123");
    errors = affiliationFee.errors || {};
    expect(errors['pattern']).toBeFalsy();
  });

  it('cutOffValue field validity', () => {
    let errors = {};
    let cutOffValue = component.form.controls['cutOffValue'];

    // Set cutOffValue to something (wrong input)
    cutOffValue.setValue("test");
    errors = cutOffValue.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set cutOffValue to something (wrong input)
    cutOffValue.setValue("10.0.123");
    errors = cutOffValue.errors || {};
    expect(errors['pattern']).toBeTruthy();
    // Set cutOffValue to something (wrong input)
    cutOffValue.setValue("0.123");
    errors = cutOffValue.errors || {};
    expect(errors['pattern']).toBeFalsy();
  });

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let settings: any;
    let params: any;
    const mockBody     = {
      hasError: false,
      message: "Setting is saved successfully."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.adminSettings(params).subscribe((res) => settings = res);

    // Test Goes here
    component.form.controls['cutOffValue'].setValue("20");
    component.form.controls['affiliationFee'].setValue("1");
    component.form.controls['affiliationAmount'].setValue("100");
    component.form.controls['withdrawalFee'].setValue("0.002");
    component.form.controls['transferFee'].setValue("0.0001");
    component.form.controls['withdrawalAutoLimit'].setValue("0.005");
    component.form.controls['withdrawalMinLimit'].setValue("0.0001");
    component.form.controls['withdrawalMaxLimit'].setValue("0.05");
    component.form.controls['transferPerUserDayLimit'].setValue("0.05");
    component.form.controls['mailChimpKey'].setValue("49ea4b6f96bba025f779fbfadasfd8a123b-us15");
    component.form.controls['mailChimpList'].setValue("d8231saba1");
    component.form.controls['mailChimpEmail'].setValue("xxxxvsdfsm@gmail.com");
    component.form.controls['mailChimpFromName'].setValue("no reply");
    expect(component.form.valid).toBeTruthy();

    // Trigger the login function
    component.updateSettings();

    // Now we can check to make sure the emitted value is correct
    expect(settings.hasError).toBe(false);
    expect(settings.message).toBe(mockBody.message);
  }));

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let settings: any;
    const mockBody     = {
      hasError: false,
      settings: {
        cutOffValue: 20, affiliationFee: 1,
        affiliationAmount: 100, withdrawalFee: 0.002,
        withdrawalAutoLimit: 0.005, withdrawalMinLimit: 0.0001,
        withdrawalMaxLimit: 0.05, transferFee: 0.0001,
        transferPerUserDayLimit: 0.05, mailChimpKey: "sadf23423dsg234232rdsr2432-us15",
        mailChimpList: "sf2323dsaf", mailChimpEmail: "xxxxvsdfsm@gmail.com",
        mailChimpFromName: "no reply"
      }
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getSettings().subscribe((res) => settings = res);

    // Trigger the login function
    component.getSettings();

    // Now we can check to make sure the emitted value is correct
    expect(settings.hasError).toBe(false);
    expect(settings.settings.cutOffValue).toBe(mockBody.settings.cutOffValue);
    expect(settings.settings.affiliationFee).toBe(mockBody.settings.affiliationFee);
    expect(settings.settings.affiliationAmount).toBe(mockBody.settings.affiliationAmount);
    expect(settings.settings.withdrawalAutoLimit).toBe(mockBody.settings.withdrawalAutoLimit);
    expect(settings.settings.withdrawalMinLimit).toBe(mockBody.settings.withdrawalMinLimit);
    expect(settings.settings.withdrawalMaxLimit).toBe(mockBody.settings.withdrawalMaxLimit);
    expect(settings.settings.transferFee).toBe(mockBody.settings.transferFee);
    expect(settings.settings.transferPerUserDayLimit).toBe(mockBody.settings.transferPerUserDayLimit);
    expect(settings.settings.mailChimpKey).toBe(mockBody.settings.mailChimpKey);
    expect(settings.settings.mailChimpList).toBe(mockBody.settings.mailChimpList);
    expect(settings.settings.mailChimpEmail).toBe(mockBody.settings.mailChimpEmail);
    expect(settings.settings.mailChimpFromName).toBe(mockBody.settings.mailChimpFromName);
  }));
});
