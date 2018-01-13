import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { BBService } from '../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { WindowRef } from '../app.windows';
import { JQueryWork } from '../app.jquery';
import 'rxjs/add/observable/throw';
import { BuyButtonComponent } from './buy-button.component';

describe('BuyButtonComponent', () => {
  let component: BuyButtonComponent;
  let fixture: ComponentFixture<BuyButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        ModalModule.forRoot()
      ],
      providers: [
        BBService,
        WindowRef,
        LocalStorageService,
        { provide: JQueryWork, userValue: JQueryWork },
        { provide: XHRBackend, useClass: MockBackend }
      ],
      declarations: [ BuyButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
