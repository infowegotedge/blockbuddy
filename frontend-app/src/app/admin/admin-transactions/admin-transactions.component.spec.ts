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
import { PaginationModule } from 'ngx-bootstrap';
import { WindowRef } from '../../app.windows';
import { Constants } from '../../app.constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { AdminTransactionsComponent } from './admin-transactions.component';

describe('AdminTransactionsComponent', () => {
  let component: AdminTransactionsComponent;
  let fixture: ComponentFixture<AdminTransactionsComponent>;

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
        { provide: XHRBackend, useClass: MockBackend }
      ],
      declarations: [ AdminTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let transfers: any;
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
      totalRows: 3,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getTransfers(params).subscribe((res) => transfers = res);

    // Trigger the login function
    component.getTransfers(1);

    // Now we can check to make sure the emitted value is correct
    expect(transfers.hasError).toBe(false);
    expect(transfers.totalRows).toBe(mockBody.totalRows);
    expect(transfers.currentPage).toBe(mockBody.currentPage);
    expect(transfers.perPage).toBe(mockBody.perPage);
    expect(transfers.transfers.length).toBe(1);
    expect(transfers.transfers[0].created_at).toBe(mockBody.transfers[0].created_at);
    expect(transfers.transfers[0].amount_transfer).toBe(mockBody.transfers[0].amount_transfer);
    expect(transfers.transfers[0].amount_fee).toBe(mockBody.transfers[0].amount_fee);
    expect(transfers.transfers[0].amount).toBe(mockBody.transfers[0].amount);
    expect(transfers.transfers[0].status).toBe(mockBody.transfers[0].status);
    expect(transfers.transfers[0].to_username).toBe(mockBody.transfers[0].to_username);
    expect(transfers.transfers[0].to_name).toBe(mockBody.transfers[0].to_name);
    expect(transfers.transfers[0].from_username).toBe(mockBody.transfers[0].from_username);
    expect(transfers.transfers[0].from_name).toBe(mockBody.transfers[0].from_name);
  }));
});
