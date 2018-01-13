/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { BBService } from '../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PaginationModule } from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WindowRef } from '../app.windows';
import { Constants } from '../app.constants';
// import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import * as jQuery from 'jquery';
import * as lodash from 'lodash';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { TeamCommunicationComponent } from './team-communication.component';
import { MyStaticsComponent } from '../my-statics/my-statics.component';
import { TopbarNavComponent } from '../topbar-nav/topbar-nav.component';

describe('TeamCommunicationComponent', () => {
  let component: TeamCommunicationComponent;
  let fixture: ComponentFixture<TeamCommunicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpModule,
        ModalModule.forRoot(),
        ConfirmationPopoverModule.forRoot({
          confirmButtonType: 'danger' // set defaults here
        }),
        PaginationModule.forRoot(),
        NgbModule.forRoot()
      ],
      providers: [
        BBService,
        WindowRef,
        LocalStorageService,
        Constants,
        { provide: jQuery, useValue: jQuery },
        { provide: lodash, useValue: lodash },
        { provide: XHRBackend, useClass: MockBackend },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {params:  Observable.of({ contentType: 'Stepan' }) },
            paramMap: { subscribe: function(params) {  } }
          }
        }
      ],
      declarations: [ TeamCommunicationComponent, MyStaticsComponent, TopbarNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submitting a service ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let inboxMessage: any;
    let currentPage: number;
    const mockBody     = {
      hasError: false,
      messages: [{
        id: "59492560cf6faa4c84bdfc61",
        subject: "Hello From Sponsor",
        message: "<p>Hello,</p><p><br></p><p>How R U?</p><p>I am Your Sponsor??</p><p><br></p><p>Thanks</p>",
        fromUserName: "ravi mehrotra",
        formUserEmail: "ravi@allies.co.in",
        createdAt: "2017-06-20T13:38:40.650Z"
      }],
      totalRows: 1,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.inboxMessage(currentPage).subscribe((res) => inboxMessage = res);

    // Trigger the login function
    component.getInboxMessage(1);

    // Now we can check to make sure the emitted value is correct
    expect(inboxMessage.hasError).toBe(false);
    expect(inboxMessage.messages.length).toBe(1);
    expect(inboxMessage.messages[0].id).toBe(mockBody.messages[0].id);
    expect(inboxMessage.messages[0].subject).toBe(mockBody.messages[0].subject);
    expect(inboxMessage.messages[0].message).toBe(mockBody.messages[0].message);
    expect(inboxMessage.messages[0].fromUserName).toBe(mockBody.messages[0].fromUserName);
    expect(inboxMessage.messages[0].formUserEmail).toBe(mockBody.messages[0].formUserEmail);
    expect(inboxMessage.messages[0].createdAt).toBe(mockBody.messages[0].createdAt);
    expect(inboxMessage.totalRows).toBe(1);
    expect(inboxMessage.currentPage).toBe(1);
    expect(inboxMessage.perPage).toBe(25);
  }));

  it('submitting a service ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let outboxMessage: any;
    let currentPage: number;
    const mockBody     = {
      hasError: false,
      messages: [{
        id: "59564593d3b86725a88a6cfe",
        subject: "Welcome",
        message: "Welcome to Our Site.",
        toUserName: "ravi4 mehrotra4,ravi2 mehrotra2",
        toUserEmail: "ravi4@allies.co.in,ravi2@allies.co.in",
        createdAt: "2017-06-30T12:35:31.674Z",
        showMore: false
      }],
      totalRows: 1,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.outboxMessage(currentPage).subscribe((res) => outboxMessage = res);

    // Trigger the login function
    component.getOutboxMessage(1);

    // Now we can check to make sure the emitted value is correct
    expect(outboxMessage.hasError).toBe(false);
    expect(outboxMessage.messages.length).toBe(1);
    expect(outboxMessage.messages[0].id).toBe(mockBody.messages[0].id);
    expect(outboxMessage.messages[0].subject).toBe(mockBody.messages[0].subject);
    expect(outboxMessage.messages[0].message).toBe(mockBody.messages[0].message);
    expect(outboxMessage.messages[0].toUserName).toBe(mockBody.messages[0].toUserName);
    expect(outboxMessage.messages[0].toUserEmail).toBe(mockBody.messages[0].toUserEmail);
    expect(outboxMessage.messages[0].createdAt).toBe(mockBody.messages[0].createdAt);
    expect(outboxMessage.messages[0].showMore).toBe(mockBody.messages[0].showMore);
    expect(outboxMessage.totalRows).toBe(1);
    expect(outboxMessage.currentPage).toBe(1);
    expect(outboxMessage.perPage).toBe(25);
  }));

  it('submitting a service ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let myDirects: any;
    let currentPage: number;
    const mockBody     = {
      hasError: false,
      directs: [{
        email: "mohd.raza+id109@allies.co.in",
        country: "india",
        mobile: "+919936868137",
        create_at: "2017-06-08T04:57:47.771Z",
        position: "L",
        userid: "5938d94bb625cb0856e3004f",
        name: "ravi109 mehrotra109",
        totalMembers: 6,
        totalPurchasePV: 0
      }]
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.outboxMessage(currentPage).subscribe((res) => myDirects = res);

    // Trigger the login function
    component.getMyDirects(1, {});

    // Now we can check to make sure the emitted value is correct
    expect(myDirects.hasError).toBe(false);
    expect(myDirects.directs.length).toBe(1);
    expect(myDirects.directs[0].email).toBe(mockBody.directs[0].email);
    expect(myDirects.directs[0].country).toBe(mockBody.directs[0].country);
    expect(myDirects.directs[0].mobile).toBe(mockBody.directs[0].mobile);
    expect(myDirects.directs[0].create_at).toBe(mockBody.directs[0].create_at);
    expect(myDirects.directs[0].position).toBe(mockBody.directs[0].position);
    expect(myDirects.directs[0].userid).toBe(mockBody.directs[0].userid);
    expect(myDirects.directs[0].name).toBe(mockBody.directs[0].name);
    expect(myDirects.directs[0].totalMembers).toBe(mockBody.directs[0].totalMembers);
    expect(myDirects.directs[0].totalPurchasePV).toBe(mockBody.directs[0].totalPurchasePV);
  }));

  it('submitting a service ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let sendMail: any;
    let post1Body: number;
    const mockBody     = {
      hasError: false,
      message: "Message is created successfully."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      subject: "Welcome",
      message: "Welcome to Our Site.",
      sent_to: [
        "5909638377891b0d4ffe677f",
        "5909630e77891b0d4ffe6779"
      ]
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.sendMail(post1Body).subscribe((res) => sendMail = res);

    // Trigger the login function
    component.sendMessage(postBody);

    // Now we can check to make sure the emitted value is correct
    expect(sendMail.hasError).toBe(false);
    expect(sendMail.message).toBe(mockBody.message);
  }));
});
