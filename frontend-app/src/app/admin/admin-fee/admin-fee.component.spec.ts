import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { BBService } from '../../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { WindowRef } from '../../app.windows';
import { Constants } from '../../app.constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { AdminFeeComponent } from './admin-fee.component';

describe('AdminFeeComponent', () => {
  let component: AdminFeeComponent;
  let fixture: ComponentFixture<AdminFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
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
        { provide: XHRBackend, useClass: MockBackend }
      ],
      declarations: [ AdminFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
  //   // Mock testing parameter
  //   let affiliationFee: any;
  //   let currPage: any;
  //   const mockBody     = {
  //     hasError: false,
  //     affiliations: [{
  //       _id: "594a709c45d4033621eec0d9",
  //       userid: "594a709845d4033621eec0cc",
  //       user_name: "ravi1498050712303 mehrotra1498050712303",
  //       user_email: "ravi1498050712303@allies.co.in",
  //       fee: 1,
  //       paid: 101,
  //       pay_through: "bitcoin",
  //       currency: "USD",
  //       verified: false,
  //       from_btc_address: "1NzU61aW2cZmFXTjiC5iT34QVrJfSPZhv8",
  //       invoice_year: "2017",
  //       invoice_no: 2017062100035,
  //       invoice_status: "COMPLETED",
  //       status: "COMPLETED",
  //       active: "Y",
  //       description: "Affiliate Fee",
  //       verifyHash: "sadfasdfasjdlfasjdflasdjflsf",
  //       end_date: "2018-06-21T13:11:57.463Z",
  //       start_date: "2017-06-21T13:11:57.463Z",
  //       updated_at: "2017-06-21T13:11:56.926Z",
  //       created_at: "2017-06-21T13:11:56.926Z"
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

  //   service.getAffiliationFee(currPage).subscribe((res) => affiliationFee = res);

  //   // Trigger the login function
  //   component.getAffiliationFee(1);

  //   // Now we can check to make sure the emitted value is correct
  //   expect(affiliationFee.hasError).toBe(false);
  //   expect(affiliationFee.totalRows).toBe(mockBody.totalRows);
  //   expect(affiliationFee.currentPage).toBe(mockBody.currentPage);
  //   expect(affiliationFee.perPage).toBe(mockBody.perPage);
  //   expect(affiliationFee.affiliations.length).toBe(1);
  //   expect(affiliationFee.affiliations[0]._id).toBe(mockBody.affiliations[0]._id);
  //   expect(affiliationFee.affiliations[0].userid).toBe(mockBody.affiliations[0].userid);
  //   expect(affiliationFee.affiliations[0].user_name).toBe(mockBody.affiliations[0].user_name);
  //   expect(affiliationFee.affiliations[0].user_email).toBe(mockBody.affiliations[0].user_email);
  //   expect(affiliationFee.affiliations[0].fee).toBe(mockBody.affiliations[0].fee);
  //   expect(affiliationFee.affiliations[0].paid).toBe(mockBody.affiliations[0].paid);
  //   expect(affiliationFee.affiliations[0].pay_through).toBe(mockBody.affiliations[0].pay_through);
  //   expect(affiliationFee.affiliations[0].currency).toBe(mockBody.affiliations[0].currency);
  //   expect(affiliationFee.affiliations[0].verified).toBe(mockBody.affiliations[0].verified);
  //   expect(affiliationFee.affiliations[0].from_btc_address).toBe(mockBody.affiliations[0].from_btc_address);
  //   expect(affiliationFee.affiliations[0].invoice_year).toBe(mockBody.affiliations[0].invoice_year);
  //   expect(affiliationFee.affiliations[0].invoice_no).toBe(mockBody.affiliations[0].invoice_no);
  //   expect(affiliationFee.affiliations[0].invoice_status).toBe(mockBody.affiliations[0].invoice_status);
  //   expect(affiliationFee.affiliations[0].status).toBe(mockBody.affiliations[0].status);
  //   expect(affiliationFee.affiliations[0].active).toBe(mockBody.affiliations[0].active);
  //   expect(affiliationFee.affiliations[0].description).toBe(mockBody.affiliations[0].description);
  //   expect(affiliationFee.affiliations[0].verifyHash).toBe(mockBody.affiliations[0].verifyHash);
  //   expect(affiliationFee.affiliations[0].end_date).toBe(mockBody.affiliations[0].end_date);
  //   expect(affiliationFee.affiliations[0].start_date).toBe(mockBody.affiliations[0].start_date);
  //   expect(affiliationFee.affiliations[0].updated_at).toBe(mockBody.affiliations[0].updated_at);
  //   expect(affiliationFee.affiliations[0].created_at).toBe(mockBody.affiliations[0].created_at);
  // }));

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let withdrawalFee: any;
    let params: any;
    const mockBody     = {
      hasError: false,
      withdrawals: [],
      totalRows: 0,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getWithdrawalFee(params).subscribe((res) => withdrawalFee = res);

    // Trigger the login function
    component.getWithdrawalFee(1);

    // Now we can check to make sure the emitted value is correct
    expect(withdrawalFee.hasError).toBe(false);
    expect(withdrawalFee.totalRows).toBe(mockBody.totalRows);
    expect(withdrawalFee.currentPage).toBe(mockBody.currentPage);
    expect(withdrawalFee.perPage).toBe(mockBody.perPage);
    expect(withdrawalFee.withdrawals.length).toBe(0);
  }));

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let transferFee: any;
    let params: any;
    const mockBody     = {
      hasError: false,
      transfers: [{
        created_at: "2017-05-20T12:55:25.118Z",
        amount_transfer: 0.0005,
        amount_fee: 0.01,
        amount: 0.0105,
        status: "COMPLETED",
        to_username: "ravimehrotra1",
        to_name: "ravi1 mehrotra1",
        from_username: "ravimehrotra",
        from_name: "ravi mehrotra"
      }],
      totalRows: 0,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getTransferFee(params).subscribe((res) => transferFee = res);

    // Trigger the login function
    component.getTransferFee(1);

    // Now we can check to make sure the emitted value is correct
    expect(transferFee.hasError).toBe(false);
    expect(transferFee.totalRows).toBe(mockBody.totalRows);
    expect(transferFee.currentPage).toBe(mockBody.currentPage);
    expect(transferFee.perPage).toBe(mockBody.perPage);
    expect(transferFee.transfers.length).toBe(1);
    expect(transferFee.transfers[0].created_at).toBe(mockBody.transfers[0].created_at);
    expect(transferFee.transfers[0].amount_transfer).toBe(mockBody.transfers[0].amount_transfer);
    expect(transferFee.transfers[0].amount_fee).toBe(mockBody.transfers[0].amount_fee);
    expect(transferFee.transfers[0].amount).toBe(mockBody.transfers[0].amount);
    expect(transferFee.transfers[0].status).toBe(mockBody.transfers[0].status);
    expect(transferFee.transfers[0].to_username).toBe(mockBody.transfers[0].to_username);
    expect(transferFee.transfers[0].to_name).toBe(mockBody.transfers[0].to_name);
    expect(transferFee.transfers[0].from_username).toBe(mockBody.transfers[0].from_username);
    expect(transferFee.transfers[0].from_name).toBe(mockBody.transfers[0].from_name);
  }));
});
