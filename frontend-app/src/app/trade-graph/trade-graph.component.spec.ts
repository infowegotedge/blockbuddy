import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeGraphComponent } from './trade-graph.component';

describe('TradeGraphComponent', () => {
  let component: TradeGraphComponent;
  let fixture: ComponentFixture<TradeGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
