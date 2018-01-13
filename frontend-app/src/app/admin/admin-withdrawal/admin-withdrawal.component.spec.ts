import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { BBService } from '../../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PaginationModule } from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WindowRef } from '../../app.windows';
import { Constants } from '../../app.constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { AdminWithdrawalComponent } from './admin-withdrawal.component';

describe('AdminWithdrawalComponent', () => {
  let component: AdminWithdrawalComponent;
  let fixture: ComponentFixture<AdminWithdrawalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule, ReactiveFormsModule,
        HttpModule,
        ModalModule.forRoot(),
        NgbModule.forRoot(),
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
        { provide: XHRBackend, useClass: MockBackend },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: { params: 'withdrawal-pending' }
          }
        }
      ],
      declarations: [ AdminWithdrawalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let withdrawals: any;
    let params: any;
    const mockBody     = {
      hasError: false,
      withdrawals: [{
        _id: "592276f03955660dd61bfb63",
        amount_withdrawal: 0.0005,
        amount_fee: 0.001,
        amount: 0.0015,
        status: "PENDING",
        user_name: "ravi mehrotra",
        auto_withdraw: true,
        btc_address: "3J3YG4vp8g1v4NTTEeCX6H51AR1G26cc4k",
        userid: "590962bb77891b0d4ffe6773",
        created_at: "2017-05-22T05:28:16.668Z",
        timestamp: 1498889514802
      }],
      totalRows: 3,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {}

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getWithdrawals(params).subscribe((res) => withdrawals = res);

    // Trigger the login function
    component.getWithdrawals(1);

    // Now we can check to make sure the emitted value is correct
    expect(withdrawals.hasError).toBe(false);
    expect(withdrawals.totalRows).toBe(mockBody.totalRows);
    expect(withdrawals.currentPage).toBe(mockBody.currentPage);
    expect(withdrawals.perPage).toBe(mockBody.perPage);
    expect(withdrawals.withdrawals.length).toBe(1);
    expect(withdrawals.withdrawals[0]._id).toBe(mockBody.withdrawals[0]._id);
    expect(withdrawals.withdrawals[0].amount_withdrawal).toBe(mockBody.withdrawals[0].amount_withdrawal);
    expect(withdrawals.withdrawals[0].amount_fee).toBe(mockBody.withdrawals[0].amount_fee);
    expect(withdrawals.withdrawals[0].amount).toBe(mockBody.withdrawals[0].amount);
    expect(withdrawals.withdrawals[0].status).toBe(mockBody.withdrawals[0].status);
    expect(withdrawals.withdrawals[0].user_name).toBe(mockBody.withdrawals[0].user_name);
    expect(withdrawals.withdrawals[0].auto_withdraw).toBe(mockBody.withdrawals[0].auto_withdraw);
    expect(withdrawals.withdrawals[0].btc_address).toBe(mockBody.withdrawals[0].btc_address);
    expect(withdrawals.withdrawals[0].userid).toBe(mockBody.withdrawals[0].userid);
    expect(withdrawals.withdrawals[0].created_at).toBe(mockBody.withdrawals[0].created_at);
    expect(withdrawals.withdrawals[0].timestamp).toBe(mockBody.withdrawals[0].timestamp);
  }));

  // it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
  //   // Mock testing parameter
  //   let withdrawals: any;
  //   let params: any;
  //   const mockBody     = {
  //     hasError: false,
  //     withdrawals: [{
  //       _id: "592276f03955660dd61bfb63",
  //       amount_withdrawal: 0.0005,
  //       amount_fee: 0.001,
  //       amount: 0.0015,
  //       status: "PENDING",
  //       user_name: "ravi mehrotra",
  //       auto_withdraw: false,
  //       btc_address: "3J3YG4vp8g1v4NTTEeCX6H51AR1G26cc4k",
  //       userid: "590962bb77891b0d4ffe6773",
  //       created_at: "2017-05-22T05:28:16.668Z",
  //       timestamp: 1498889514802
  //     }],
  //     totalRows: 3,
  //     currentPage: 1,
  //     perPage: 25
  //   }
  //   const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
  //   const postBody = {}

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(mockResponse));
  //   });

  //   service.getWithdrawals(params).subscribe((res) => withdrawals = res);

  //   // Trigger the login function
  //   component.getWithdrawalManual(1);

  //   // Now we can check to make sure the emitted value is correct
  //   expect(withdrawals.hasError).toBe(false);
  //   expect(withdrawals.totalRows).toBe(mockBody.totalRows);
  //   expect(withdrawals.currentPage).toBe(mockBody.currentPage);
  //   expect(withdrawals.perPage).toBe(mockBody.perPage);
  //   expect(withdrawals.withdrawals.length).toBe(1);
  //   expect(withdrawals.withdrawals[0]._id).toBe(mockBody.withdrawals[0]._id);
  //   expect(withdrawals.withdrawals[0].amount_withdrawal).toBe(mockBody.withdrawals[0].amount_withdrawal);
  //   expect(withdrawals.withdrawals[0].amount_fee).toBe(mockBody.withdrawals[0].amount_fee);
  //   expect(withdrawals.withdrawals[0].amount).toBe(mockBody.withdrawals[0].amount);
  //   expect(withdrawals.withdrawals[0].status).toBe(mockBody.withdrawals[0].status);
  //   expect(withdrawals.withdrawals[0].user_name).toBe(mockBody.withdrawals[0].user_name);
  //   expect(withdrawals.withdrawals[0].auto_withdraw).toBe(mockBody.withdrawals[0].auto_withdraw);
  //   expect(withdrawals.withdrawals[0].btc_address).toBe(mockBody.withdrawals[0].btc_address);
  //   expect(withdrawals.withdrawals[0].userid).toBe(mockBody.withdrawals[0].userid);
  //   expect(withdrawals.withdrawals[0].created_at).toBe(mockBody.withdrawals[0].created_at);
  //   expect(withdrawals.withdrawals[0].timestamp).toBe(mockBody.withdrawals[0].timestamp);
  // }));

  // it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
  //   // Mock testing parameter
  //   let withdrawals: any;
  //   let params: any;
  //   const mockBody     = {
  //     hasError: false,
  //     withdrawals: [{
  //       _id: "592276f03955660dd61bfb63",
  //       amount_withdrawal: 0.0005,
  //       amount_fee: 0.001,
  //       amount: 0.0015,
  //       status: "HOLD",
  //       user_name: "ravi mehrotra",
  //       auto_withdraw: false,
  //       btc_address: "3J3YG4vp8g1v4NTTEeCX6H51AR1G26cc4k",
  //       userid: "590962bb77891b0d4ffe6773",
  //       created_at: "2017-05-22T05:28:16.668Z",
  //       timestamp: 1498889514802
  //     }],
  //     totalRows: 3,
  //     currentPage: 1,
  //     perPage: 25
  //   }
  //   const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
  //   const postBody = {}

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(mockResponse));
  //   });

  //   service.getWithdrawals(params).subscribe((res) => withdrawals = res);

  //   // Trigger the login function
  //   component.getWithdrawalHold(1);

  //   // Now we can check to make sure the emitted value is correct
  //   expect(withdrawals.hasError).toBe(false);
  //   expect(withdrawals.totalRows).toBe(mockBody.totalRows);
  //   expect(withdrawals.currentPage).toBe(mockBody.currentPage);
  //   expect(withdrawals.perPage).toBe(mockBody.perPage);
  //   expect(withdrawals.withdrawals.length).toBe(1);
  //   expect(withdrawals.withdrawals[0]._id).toBe(mockBody.withdrawals[0]._id);
  //   expect(withdrawals.withdrawals[0].amount_withdrawal).toBe(mockBody.withdrawals[0].amount_withdrawal);
  //   expect(withdrawals.withdrawals[0].amount_fee).toBe(mockBody.withdrawals[0].amount_fee);
  //   expect(withdrawals.withdrawals[0].amount).toBe(mockBody.withdrawals[0].amount);
  //   expect(withdrawals.withdrawals[0].status).toBe(mockBody.withdrawals[0].status);
  //   expect(withdrawals.withdrawals[0].user_name).toBe(mockBody.withdrawals[0].user_name);
  //   expect(withdrawals.withdrawals[0].auto_withdraw).toBe(mockBody.withdrawals[0].auto_withdraw);
  //   expect(withdrawals.withdrawals[0].btc_address).toBe(mockBody.withdrawals[0].btc_address);
  //   expect(withdrawals.withdrawals[0].userid).toBe(mockBody.withdrawals[0].userid);
  //   expect(withdrawals.withdrawals[0].created_at).toBe(mockBody.withdrawals[0].created_at);
  //   expect(withdrawals.withdrawals[0].timestamp).toBe(mockBody.withdrawals[0].timestamp);
  // }));

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let withdrawals: any;
    let params: any;
    const mockBody     = {
      hasError: false,
      withdrawals: [{
        _id: "592276f03955660dd61bfb63",
        amount_withdrawal: 0.0005,
        amount_fee: 0.001,
        amount: 0.0015,
        status: "COMPLETED",
        user_name: "ravi mehrotra",
        auto_withdraw: false,
        btc_address: "3J3YG4vp8g1v4NTTEeCX6H51AR1G26cc4k",
        userid: "590962bb77891b0d4ffe6773",
        created_at: "2017-05-22T05:28:16.668Z",
        timestamp: 1498889514802
      }],
      totalRows: 3,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {}

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getWithdrawals(params).subscribe((res) => withdrawals = res);

    // Trigger the login function
    component.getWithdrawalCompleted(1);

    // Now we can check to make sure the emitted value is correct
    expect(withdrawals.hasError).toBe(false);
    expect(withdrawals.totalRows).toBe(mockBody.totalRows);
    expect(withdrawals.currentPage).toBe(mockBody.currentPage);
    expect(withdrawals.perPage).toBe(mockBody.perPage);
    expect(withdrawals.withdrawals.length).toBe(1);
    expect(withdrawals.withdrawals[0]._id).toBe(mockBody.withdrawals[0]._id);
    expect(withdrawals.withdrawals[0].amount_withdrawal).toBe(mockBody.withdrawals[0].amount_withdrawal);
    expect(withdrawals.withdrawals[0].amount_fee).toBe(mockBody.withdrawals[0].amount_fee);
    expect(withdrawals.withdrawals[0].amount).toBe(mockBody.withdrawals[0].amount);
    expect(withdrawals.withdrawals[0].status).toBe(mockBody.withdrawals[0].status);
    expect(withdrawals.withdrawals[0].user_name).toBe(mockBody.withdrawals[0].user_name);
    expect(withdrawals.withdrawals[0].auto_withdraw).toBe(mockBody.withdrawals[0].auto_withdraw);
    expect(withdrawals.withdrawals[0].btc_address).toBe(mockBody.withdrawals[0].btc_address);
    expect(withdrawals.withdrawals[0].userid).toBe(mockBody.withdrawals[0].userid);
    expect(withdrawals.withdrawals[0].created_at).toBe(mockBody.withdrawals[0].created_at);
    expect(withdrawals.withdrawals[0].timestamp).toBe(mockBody.withdrawals[0].timestamp);
  }));
});
