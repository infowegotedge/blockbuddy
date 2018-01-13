import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Params, Router, ActivatedRoute} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
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
import { UserGrantLoginComponent } from './user-grant-login.component';
import { routing } from '../../app.routes';
import { CookieModule, CookieService } from 'ngx-cookie';


class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('UserGrantLoginComponent', () => {
  let location: Location;
  let component: UserGrantLoginComponent;
  let fixture: ComponentFixture<UserGrantLoginComponent>;
  let mockRouter = new MockRouter();

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
        RouterTestingModule,
        CookieModule.forRoot()
      ],
      providers: [
        BBService,
        WindowRef,
        LocalStorageService,
        Constants,
        CookieService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {username:  "ravimehrotra89", uc: true} } } },
        { provide: XHRBackend, useClass: MockBackend }
      ],
      declarations: [ UserGrantLoginComponent ]
    })
    .compileComponents();

    location = TestBed.get(Location);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGrantLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('submitting a form ...', inject([BBService, XHRBackend], fakeAsync((service: BBService, mockBackend) => {
    // Mock testing parameter
    let users: any;
    let params: any;
    const mockBody     = {
      hasError: false,
      token: "asdfasdf-asdfasf-sadfsaf-24234o2jsdf2",
      role: 'user'
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.loginAsUser(params).subscribe((res) => users = res);

    // Trigger the login function
    component.loginAsUser();
    tick(100); 

    // Now we can check to make sure the emitted value is correct
    expect(users.hasError).toBe(false);
    expect(users.token).toBe(mockBody.token);
    expect(users.role).toBe(mockBody.role);
    expect(location.path()).toBe('');
  })));
});
