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
import { StaticComponent } from './static.component';
import { BuyButtonComponent } from '../buy-button/buy-button.component';
import { MyStaticsComponent } from '../my-statics/my-statics.component';
import { TopbarNavComponent } from '../topbar-nav/topbar-nav.component';

describe('StaticComponent', () => {
  let component: StaticComponent;
  let fixture: ComponentFixture<StaticComponent>;

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
      declarations: [ StaticComponent, BuyButtonComponent, MyStaticsComponent, TopbarNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
