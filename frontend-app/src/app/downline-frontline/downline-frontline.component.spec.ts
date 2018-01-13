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
import { PaginationModule } from 'ngx-bootstrap';
import { WindowRef } from '../app.windows';
import { Constants } from '../app.constants';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { MyStaticsComponent } from '../my-statics/my-statics.component';
import { TopbarNavComponent } from '../topbar-nav/topbar-nav.component';
import { TimeAgoPipe } from 'time-ago-pipe';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { DownlineFrontlineComponent } from './downline-frontline.component';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}


describe('DownlineFrontlineComponent', () => {
  let component: DownlineFrontlineComponent;
  let fixture: ComponentFixture<DownlineFrontlineComponent>;
  let mockRouter = new MockRouter();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        ModalModule.forRoot(),
        ConfirmationPopoverModule.forRoot({confirmButtonType: 'danger'}),
        PaginationModule.forRoot()
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
      declarations: [ DownlineFrontlineComponent, MyStaticsComponent, TopbarNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownlineFrontlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
