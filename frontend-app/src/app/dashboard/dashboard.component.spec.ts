/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { BBService } from '../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { WindowRef } from '../app.windows';
import { Constants } from '../app.constants';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { TimeAgoPipe } from 'time-ago-pipe';
import { AmChartsModule, AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { DashboardComponent } from './dashboard.component';
import { TopbarNavComponent } from '../topbar-nav/topbar-nav.component';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockRouter = new MockRouter();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        ModalModule.forRoot(),
        ConfirmationPopoverModule.forRoot({confirmButtonType: 'danger'}),
        AmChartsModule
      ],
      providers: [
        BBService,
        WindowRef,
        LocalStorageService,
        Constants,
        { provide: Router, useValue: mockRouter },
        { provide: XHRBackend, useClass: MockBackend },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {params:  Observable.of({ contentType: 'Stepan' }) },
            paramMap: { subscribe: function(params) {  } }
          }
        }
      ],
      declarations: [ DashboardComponent, TimeAgoPipe, TopbarNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
  //   // Mock testing parameter
  //   let curRates: any;
  //   const mockBody     = {
  //     hasError: false,
  //     unit: "BTC",
  //     currentRates: {
  //       price_btc: 0.00027,
  //       price_usd: 0.38688286499999996
  //     },
  //     pool: {
  //       btcRates: 0.00027,
  //       usdRates: 0.38688286499999996
  //     },
  //     machine: {
  //       btcRates: 0.00027,
  //       usdRates: 0.38688286499999996
  //     },
  //     rack: {
  //       btcRates: 0.00027,
  //       usdRates: 0.38688286499999996
  //     }
  //   };
  //   const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(mockResponse));
  //   });

  //   service.getCurrentRates().subscribe((res) => curRates = res);

  //   // Trigger the login function
  //   component.getCurrentRates();

  //   // Now we can check to make sure the emitted value is correct
  //   expect(curRates.hasError).toBe(false);
  //   expect(curRates.unit).toBe(mockBody.unit);
  //   expect(curRates.currentRates.price_btc).toBe(mockBody.currentRates.price_btc);
  //   expect(curRates.currentRates.price_usd).toBe(mockBody.currentRates.price_usd);
  //   expect(curRates.pool.btcRates).toBe(mockBody.pool.btcRates);
  //   expect(curRates.pool.usdRates).toBe(mockBody.pool.usdRates);
  //   expect(curRates.machine.btcRates).toBe(mockBody.machine.btcRates);
  //   expect(curRates.machine.usdRates).toBe(mockBody.machine.usdRates);
  //   expect(curRates.rack.btcRates).toBe(mockBody.rack.btcRates);
  //   expect(curRates.rack.usdRates).toBe(mockBody.rack.usdRates);
  // }));

  // it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
  //   // Mock testing parameter
  //   let purPower: any;
  //   const mockBody     = {
  //     hasError: false,
  //     totalPower: {
  //       coin: "BTC",
  //       miningPower: 0
  //     }
  //   };
  //   const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(mockResponse));
  //   });

  //   service.getPurchasedPower().subscribe((res) => purPower = res);

  //   // Trigger the login function
  //   component.getPurchasedPower();

  //   // Now we can check to make sure the emitted value is correct
  //   expect(purPower.hasError).toBe(false);
  //   expect(purPower.totalPower.coin).toBe(mockBody.totalPower.coin);
  //   expect(purPower.totalPower.miningPower).toBe(mockBody.totalPower.miningPower);
  // }));

  // it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
  //   // Mock testing parameter
  //   let totalIncome: any;
  //   const mockBody     = {
  //     hasError: false,
  //     totalIncome: {
  //       coin: "BTC",
  //       totalUSD: 0,
  //       totalBTC: 0
  //     }
  //   };
  //   const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(mockResponse));
  //   });

  //   service.getTotalIncome().subscribe((res) => totalIncome = res);

  //   // Trigger the login function
  //   component.getTotalIncome();

  //   // Now we can check to make sure the emitted value is correct
  //   expect(totalIncome.hasError).toBe(false);
  //   expect(totalIncome.totalIncome.coin).toBe(mockBody.totalIncome.coin);
  //   expect(totalIncome.totalIncome.totalUSD).toBe(mockBody.totalIncome.totalUSD);
  //   expect(totalIncome.totalIncome.totalBTC).toBe(mockBody.totalIncome.totalBTC);
  // }));

  // it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
  //   // Mock testing parameter
  //   let virtualTree: any;
  //   let packages: any;
  //   const mockBody     = {
  //     hasError: false,
  //     treeview: {
  //       username: "ravimehrotra89",
  //       name: "ravi89 mehrotra89",
  //       doj: "2017-05-20T06:46:31.614Z",
  //       sponsor: "590962bb77891b0d4ffe6773",
  //       itemName: "",
  //       leftPV: 0,
  //       rightPV: 0,
  //       leftCount: 0,
  //       rightCount: 0,
  //       totalDirects: 14,
  //       virtualPair: 0
  //     },
  //     package: {
  //       pool: { name: "Pool", price: 100, precent: 8, power: 3, pv: 1 },
  //       machine: { name: "Machine", price: 1000, precent: 10, power: 30, pv: 11 },
  //       rack: { name: "Rack", price: 10000, precent: 12, power: 3000, pv: 110 }
  //     }
  //   };
  //   const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(mockResponse));
  //   });

  //   service.getVirtualTree().subscribe((res) => virtualTree = res);
  //   service.getPackages().subscribe((res) => packages = res);

  //   // Trigger the login function
  //   component.getVirtualTree();

  //   // Now we can check to make sure the emitted value is correct
  //   expect(virtualTree.hasError).toBe(false);
  //   expect(virtualTree.treeview.username).toBe(mockBody.treeview.username);
  //   expect(virtualTree.treeview.name).toBe(mockBody.treeview.name);
  //   expect(virtualTree.treeview.doj).toBe(mockBody.treeview.doj);
  //   expect(virtualTree.treeview.sponsor).toBe(mockBody.treeview.sponsor);
  //   expect(virtualTree.treeview.itemName).toBe(mockBody.treeview.itemName);
  //   expect(virtualTree.treeview.leftPV).toBe(mockBody.treeview.leftPV);
  //   expect(virtualTree.treeview.rightPV).toBe(mockBody.treeview.rightPV);
  //   expect(virtualTree.treeview.leftCount).toBe(mockBody.treeview.leftCount);
  //   expect(virtualTree.treeview.rightCount).toBe(mockBody.treeview.rightCount);
  //   expect(virtualTree.treeview.totalDirects).toBe(mockBody.treeview.totalDirects);
  //   expect(virtualTree.treeview.virtualPair).toBe(mockBody.treeview.virtualPair);
  // }));

  // it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
  //   // Mock testing parameter
  //   let resBody: any;
  //   const mockBody     = {
  //     hasError: false,
  //     package: {
  //       pool: { name: "Pool", price: 100, precent: 8, power: 3, pv: 1 },
  //       machine: { name: "Machine", price: 1000, precent: 10, power: 30, pv: 11 },
  //       rack: { name: "Rack", price: 10000, precent: 12, power: 3000, pv: 110 }
  //     }
  //   };
  //   const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(mockResponse));
  //   });

  //   service.getPackages().subscribe((res) => resBody = res);

  //   // Trigger the login function
  //   component.getPackages();

  //   // Now we can check to make sure the emitted value is correct
  //   expect(resBody.hasError).toBe(false);
  //   expect(resBody.package.pool.name).toBe(mockBody.package.pool.name);
  //   expect(resBody.package.pool.price).toBe(mockBody.package.pool.price);
  //   expect(resBody.package.pool.precent).toBe(mockBody.package.pool.precent);
  //   expect(resBody.package.pool.power).toBe(mockBody.package.pool.power);
  //   expect(resBody.package.pool.pv).toBe(mockBody.package.pool.pv);

  //   expect(resBody.package.machine.name).toBe(mockBody.package.machine.name);
  //   expect(resBody.package.machine.price).toBe(mockBody.package.machine.price);
  //   expect(resBody.package.machine.precent).toBe(mockBody.package.machine.precent);
  //   expect(resBody.package.machine.power).toBe(mockBody.package.machine.power);
  //   expect(resBody.package.machine.pv).toBe(mockBody.package.machine.pv);

  //   expect(resBody.package.rack.name).toBe(mockBody.package.rack.name);
  //   expect(resBody.package.rack.price).toBe(mockBody.package.rack.price);
  //   expect(resBody.package.rack.precent).toBe(mockBody.package.rack.precent);
  //   expect(resBody.package.rack.power).toBe(mockBody.package.rack.power);
  //   expect(resBody.package.rack.pv).toBe(mockBody.package.rack.pv);
  // }));

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let latestSignup: any;
    let country: any;
    const mockBody     = {
      hasError: false,
      latestSignup: [{
        fname: "ravi1498050713396",
        lname: "mehrotra1498050713396",
        country: "india",
        username: "ravimehrotra1498050713396"
      }],
      "india":"IN"
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getLatestSignups().subscribe((res) => latestSignup = res);
    service.countryFlag().subscribe((res) => country = res);

    // Trigger the login function
    component.getLatestSignups();

    // Now we can check to make sure the emitted value is correct
    expect(latestSignup.hasError).toBe(false);
    expect(latestSignup.latestSignup.length).toBe(1);
    expect(latestSignup.latestSignup[0].fname).toBe(mockBody.latestSignup[0].fname);
    expect(latestSignup.latestSignup[0].lname).toBe(mockBody.latestSignup[0].lname);
    expect(latestSignup.latestSignup[0].country).toBe(mockBody.latestSignup[0].country);
    expect(latestSignup.latestSignup[0].username).toBe(mockBody.latestSignup[0].username);
  }));
});
