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

import { UserManagementComponent } from './user-management.component';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;

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
      declarations: [ UserManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('fname field validity', () => {
    let errors = {};
    let fname = component.form.controls['fname'];
    expect(fname.valid).toBeFalsy();

    // First Name field is required
    errors = fname.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set First Name to something
    fname.setValue("test");
    errors = fname.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('lname field validity', () => {
    let errors = {};
    let lname = component.form.controls['lname'];
    expect(lname.valid).toBeFalsy();

    // Last Name field is required
    errors = lname.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set Last Name to something
    lname.setValue("test");
    errors = lname.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('email field validity', () => {
    let errors = {};
    let email = component.form.controls['email'];
    expect(email.valid).toBeFalsy();

    // Email field is required
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something (wrong input)
    email.setValue("test");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();
    // Set email to something (wrong input)
    email.setValue("test@.com");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();
    // Set email to something (wrong input)
    email.setValue("@.com");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();
    // Set email to something (wrong input)
    email.setValue("@test.com");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();
    // Set email to something (wrong input)
    email.setValue("test.com");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();
    // Set email to something (wrong input)
    email.setValue("test.co.in");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    // Set email to something (correct input)
    email.setValue("test@test.com");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  });

  it('username field validity', () => {
    let errors = {};
    let username = component.form.controls['username'];
    expect(username.valid).toBeFalsy();

    // Username field is required
    errors = username.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set Username to something
    username.setValue("test");
    errors = username.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('mobile field validity', () => {
    let errors = {};
    let mobile = component.form.controls['mobile'];
    expect(mobile.valid).toBeFalsy();

    // Mobile field is required
    errors = mobile.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set mobile to something
    mobile.setValue("+91");
    errors = mobile.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeTruthy();

    mobile.setValue("+911234567890");
    errors = mobile.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeFalsy();
  });

  it('country field validity', () => {
    let errors = {};
    let country = component.form.controls['country'];
    expect(country.valid).toBeFalsy();

    // country field is required
    errors = country.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set country to something
    country.setValue("India");
    errors = country.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('password field validity', () => {
    let errors = {};
    let password = component.form.controls['password'];

    // Set password to something
    password.setValue("asdf");
    errors = password.errors || {};
    expect(errors['pattern']).toBeTruthy();
    expect(errors['minlength']).toBeTruthy();

    password.setValue("123343");
    errors = password.errors || {};
    expect(errors['pattern']).toBeTruthy();
    expect(errors['minlength']).toBeFalsy();

    password.setValue("ravi4323");
    errors = password.errors || {};
    expect(errors['pattern']).toBeFalsy();
    expect(errors['minlength']).toBeFalsy();
  });

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let users: any;
    let params: any;
    const mockBody     = {
      hasError: false,
      users: [{
        _id: "594a709945d4033621eec0d4",
        hashpass: "36bd845599f74a5cf8dcee0cc16cd780",
        fname: "ravi1498050713396",
        lname: "mehrotra1498050713396",
        email: "ravi1498050713396@allies.co.in",
        mobile: "+911234567890",
        sponsorid: "590962098293f70fcba92f8c",
        ip: "127.0.0.1",
        country: "india",
        username: "ravimehrotra1498050713396",
        sponsorname: "hash farm",
        sponsorusername: "bb",
        updated_at: "2017-06-21T13:11:53.403Z",
        unix_date: 1498050713403,
        verify_email: false,
        role: [
          "user",
          "transaction"
        ],
        created_at: "2017-06-21T13:11:53.403Z"
      }],
      totalRows: 1,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {}

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getUsersList(params).subscribe((res) => users = res);

    // Trigger the login function
    component.getUsersList(1);

    // Now we can check to make sure the emitted value is correct
    expect(users.hasError).toBe(false);
    expect(users.users.length).toBe(1);
    expect(users.users[0]._id).toBe(mockBody.users[0]._id);
    expect(users.users[0].hashpass).toBe(mockBody.users[0].hashpass);
    expect(users.users[0].fname).toBe(mockBody.users[0].fname);
    expect(users.users[0].lname).toBe(mockBody.users[0].lname);
    expect(users.users[0].email).toBe(mockBody.users[0].email);
    expect(users.users[0].mobile).toBe(mockBody.users[0].mobile);
    expect(users.users[0].sponsorid).toBe(mockBody.users[0].sponsorid);
    expect(users.users[0].ip).toBe(mockBody.users[0].ip);
    expect(users.users[0].country).toBe(mockBody.users[0].country);
    expect(users.users[0].username).toBe(mockBody.users[0].username);
    expect(users.users[0].sponsorname).toBe(mockBody.users[0].sponsorname);
    expect(users.users[0].sponsorusername).toBe(mockBody.users[0].sponsorusername);
    expect(users.users[0].updated_at).toBe(mockBody.users[0].updated_at);
    expect(users.users[0].unix_date).toBe(mockBody.users[0].unix_date);
    expect(users.users[0].verify_email).toBe(mockBody.users[0].verify_email);
    expect(users.users[0].created_at).toBe(mockBody.users[0].created_at);
    expect(users.totalRows).toBe(mockBody.totalRows);
    expect(users.currentPage).toBe(mockBody.currentPage);
    expect(users.perPage).toBe(mockBody.perPage);
  }));

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let users: any;
    let params: any;
    let usersList: any;
    const mockBody     = {
      hasError: false,
      message: "User update successfully",
      users: [{
        _id: "594a709945d4033621eec0d4",
        hashpass: "36bd845599f74a5cf8dcee0cc16cd780",
        fname: "ravi1498050713396",
        lname: "mehrotra1498050713396",
        email: "ravi1498050713396@allies.co.in",
        mobile: "+911234567890",
        sponsorid: "590962098293f70fcba92f8c",
        ip: "127.0.0.1",
        country: "india",
        username: "ravimehrotra1498050713396",
        sponsorname: "hash farm",
        sponsorusername: "bb",
        updated_at: "2017-06-21T13:11:53.403Z",
        unix_date: 1498050713403,
        verify_email: false,
        role: [
          "user",
          "transaction"
        ],
        created_at: "2017-06-21T13:11:53.403Z"
      }],
      totalRows: 1,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.updateUser(params).subscribe((res) => users = res);
    service.getUsersList(params).subscribe((res) => usersList = res);

    // Test Goes here
    expect(component.form.valid).toBeFalsy();
    component.userEdit._id = 'asf23492uao2934239ryfa';
    component.form.controls['fname'].setValue("test");
    component.form.controls['lname'].setValue("test123");
    component.form.controls['email'].setValue("test@test.com");
    component.form.controls['username'].setValue("test123");
    component.form.controls['mobile'].setValue("1234567890");
    component.form.controls['country'].setValue("india");
    component.form.controls['password'].setValue("test123");
    component.form.controls['address'].setValue("test123");
    component.form.controls['city'].setValue("test");
    component.form.controls['state'].setValue("test123");
    component.form.controls['postal'].setValue("test");
    expect(component.form.valid).toBeTruthy();

    // Trigger the login function
    component.updateUser();

    // Now we can check to make sure the emitted value is correct
    expect(users.hasError).toBe(false);
    expect(users.message).toBe(mockBody.message);
  }));
});
