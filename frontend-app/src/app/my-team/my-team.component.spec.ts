/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { BBService } from '../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeModule } from 'angular-tree-component';
import { WindowRef } from '../app.windows';
import { Constants } from '../app.constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { MyTeamComponent } from './my-team.component';
import { MyStaticsComponent } from '../my-statics/my-statics.component';
import { TopbarNavComponent } from '../topbar-nav/topbar-nav.component';

describe('MyTeamComponent', () => {
  let component: MyTeamComponent;
  let fixture: ComponentFixture<MyTeamComponent>;

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
        NgbModule.forRoot(),
        TreeModule
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
        { provide: XHRBackend, useClass: MockBackend },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {params:  Observable.of({ contentType: 'Stepan' }) },
            paramMap: { subscribe: function(params) {  } }
          }
        }
      ],
      declarations: [ MyTeamComponent, MyStaticsComponent, TopbarNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('username field validity', () => {
    let errors = {};
    let username = component.form.controls['username'];
    expect(username.valid).toBeTruthy();
  });

  // it('submitting a service ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
  //   // Mock testing parameter
  //   let myDirects: any;
  //   let currentPage: any;
  //   const mockBody     = {
  //     hasError: false,
  //     directs: [{
  //       email: "mohd.raza+id109@allies.co.in",
  //       country: "india",
  //       mobile: "+919936868137",
  //       create_at: "2017-06-08T04:57:47.771Z",
  //       position: "L",
  //       userid: "5938d94bb625cb0856e3004f",
  //       name: "ravi109 mehrotra109",
  //       totalMembers: 6,
  //       totalPurchasePV: 0
  //     }]
  //   };
  //   const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(mockResponse));
  //   });

  //   service.getMyDirects(currentPage).subscribe((res) => myDirects = res);

  //   // Trigger the login function
  //   component.getMyDirects(1);

  //   // Now we can check to make sure the emitted value is correct
  //   expect(myDirects.hasError).toBe(false);
  //   expect(myDirects.directs.length).toBe(1);
  //   expect(myDirects.directs[0].email).toBe(mockBody.directs[0].email);
  //   expect(myDirects.directs[0].country).toBe(mockBody.directs[0].country);
  //   expect(myDirects.directs[0].mobile).toBe(mockBody.directs[0].mobile);
  //   expect(myDirects.directs[0].create_at).toBe(mockBody.directs[0].create_at);
  //   expect(myDirects.directs[0].position).toBe(mockBody.directs[0].position);
  //   expect(myDirects.directs[0].userid).toBe(mockBody.directs[0].userid);
  //   expect(myDirects.directs[0].name).toBe(mockBody.directs[0].name);
  //   expect(myDirects.directs[0].totalMembers).toBe(mockBody.directs[0].totalMembers);
  //   expect(myDirects.directs[0].totalPurchasePV).toBe(mockBody.directs[0].totalPurchasePV);
  // }));

  // it('submitting a service ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
  //   // Mock testing parameter
  //   let myTeam: any;
  //   let currentPage: any;
  //   const mockBody     = {
  //     hasError: false,
  //     users: [{
  //       level: 1,
  //       sponsor: "ravimehrotra",
  //       country: "india",
  //       joinat: "2017-06-09T07:17:45.184Z",
  //       name: "ravi109 mehrotra109",
  //       username: "ravimehrotra109"
  //     }]
  //   }
  //   const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(mockResponse));
  //   });

  //   service.myTeam(currentPage).subscribe((res) => myTeam = res);

  //   // Trigger the login function
  //   component.getMyTeam(1);

  //   // Now we can check to make sure the emitted value is correct
  //   expect(myTeam.hasError).toBe(false);
  //   expect(myTeam.users.length).toBe(1);
  //   expect(myTeam.users[0].level).toBe(mockBody.users[0].level);
  //   expect(myTeam.users[0].sponsor).toBe(mockBody.users[0].sponsor);
  //   expect(myTeam.users[0].country).toBe(mockBody.users[0].country);
  //   expect(myTeam.users[0].joinat).toBe(mockBody.users[0].joinat);
  //   expect(myTeam.users[0].name).toBe(mockBody.users[0].name);
  //   expect(myTeam.users[0].username).toBe(mockBody.users[0].username);
  // }));

  // it('submitting a service ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
  //   // Mock testing parameter
  //   let leaderboard: any;
  //   const mockBody     = {
  //     hasError: false,
  //     last7days: [],
  //     last30Days: [],
  //     allUsers: []
  //   }
  //   const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
  //   const postBody = {
  //     token: 412390
  //   }

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(mockResponse));
  //   });

  //   service.leaderboard().subscribe((res) => leaderboard = res);

  //   // Trigger the login function
  //   component.getLeaderBoard();

  //   // Now we can check to make sure the emitted value is correct
  //   expect(leaderboard.hasError).toBe(false);
  //   expect(leaderboard.last7days.length).toBe(0);
  //   expect(leaderboard.last30Days.length).toBe(0);
  //   expect(leaderboard.allUsers.length).toBe(0);
  // }));

  it('submitting a service ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let myNetwork: any;
    let username: any;
    const mockBody     = {
      hasError: false,
      users: [{},{},{},{},{},{}]
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.myNetwork(username).subscribe((res) => myNetwork = res);

    // Trigger the login function
    component.getMyNetwork('ravimehrotra');

    // Now we can check to make sure the emitted value is correct
    expect(myNetwork.hasError).toBe(false);
    expect(myNetwork.users.length).toBe(6);
  }));
});
