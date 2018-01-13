/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { BBService } from '../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PaginationModule, PaginationConfig } from 'ngx-bootstrap';
import { WindowRef } from '../app.windows';
import { Constants } from '../app.constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { WalletComponent } from './wallet.component';
import { MyStaticsComponent } from '../my-statics/my-statics.component';
import { TopbarNavComponent } from '../topbar-nav/topbar-nav.component';

describe('WalletComponent', () => {
  let component: WalletComponent;
  let fixture: ComponentFixture<WalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule, ReactiveFormsModule,
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
        { provide: XHRBackend, useClass: MockBackend },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {params:  Observable.of({ contentType: 'Stepan' }) },
            paramMap: { subscribe: function(params) {  } }
          }
        }
      ],
      declarations: [ WalletComponent, MyStaticsComponent, TopbarNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('submitting a service ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
  //   // Mock testing parameter
  //   let btcInfo: any;
  //   const mockBody     = {
  //     hasError: false,
  //     btcWallet: {
  //       btcAddress: "1A56svALNtXPrXGt3fvwUVQPhnsUGAe1EQ",
  //       btcAmount: 0
  //     }
  //   };
  //   const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(mockResponse));
  //   });

  //   service.btcInfo().subscribe((res) => btcInfo = res);

  //   // Trigger the login function
  //   component.getBtcInfo();

  //   // Now we can check to make sure the emitted value is correct
  //   expect(btcInfo.hasError).toBe(mockBody.hasError);
  //   expect(btcInfo.btcWallet.btcAddress).toBe(mockBody.btcWallet.btcAddress);
  //   expect(btcInfo.btcWallet.btcAmount).toBe(mockBody.btcWallet.btcAmount);
  // }));

  it('submitting a service ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let transactions: any;
    let currentPage: number;
    const mockBody     = {
      hasError: false,
      transactions: [],
      totalRows: 0,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.transactions(currentPage).subscribe((res) => transactions = res);

    // Trigger the login function
    component.getTransactions(1);

    // Now we can check to make sure the emitted value is correct
    expect(transactions.hasError).toBe(mockBody.hasError);
    expect(transactions.transactions.length).toBe(mockBody.transactions.length);
    expect(transactions.totalRows).toBe(mockBody.totalRows);
    expect(transactions.currentPage).toBe(mockBody.currentPage);
    expect(transactions.perPage).toBe(mockBody.perPage);
  }));

  // it('submitting a service ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
  //   // Mock testing parameter
  //   let usdInfo: any;
  //   const mockBody     = {
  //     hasError: false,
  //     wallet: {
  //       amount: 0
  //     }
  //   };
  //   const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(mockResponse));
  //   });

  //   service.usdInfo().subscribe((res) => usdInfo = res);

  //   // Trigger the login function
  //   component.getUsdInfo();

  //   // Now we can check to make sure the emitted value is correct
  //   expect(usdInfo.hasError).toBe(mockBody.hasError);
  //   expect(usdInfo.wallet.amount).toBe(mockBody.wallet.amount);
  // }));

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
