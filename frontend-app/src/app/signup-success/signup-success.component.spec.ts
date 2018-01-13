/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { FormsModule } from '@angular/forms';
import { Params, Router, ActivatedRoute} from '@angular/router';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { BBService } from '../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PaginationModule } from 'ngx-bootstrap';
import { WindowRef } from '../app.windows';
import { Constants } from '../app.constants';
import { JQueryWork } from '../app.jquery';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { SignupSuccessComponent } from './signup-success.component';

describe('SignupSuccessComponent', () => {
  let component: SignupSuccessComponent;
  let fixture: ComponentFixture<SignupSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
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
        Constants, {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {token: "sdfasfdads-asdfas-asdfasf-sadfasf-asdfasdfsdfs"}
            }
          }
        },
        { provide: JQueryWork, useValue: JQueryWork },
        { provide: XHRBackend, useClass: MockBackend }
      ],
      declarations: [ SignupSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submitting a service ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let postOut: any;
    let postData: any;
    const mockBody     = {
      hasError: false,
      message: "Email Verified"
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.verifyEmail(postData).subscribe((res) => postOut = res);

    // Trigger the login function
    component.tokenId = "0448c750-4c07-11e7-98b5-732def4376e5";
    component.verifyEmail();

    // Now we can check to make sure the emitted value is correct
    expect(postOut.hasError).toBe(false);
    expect(postOut.message).toBe(mockBody.message);
  }));
});
