import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCmsComponent } from './admin-cms.component';

describe('AdminCmsComponent', () => {
  let component: AdminCmsComponent;
  let fixture: ComponentFixture<AdminCmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
