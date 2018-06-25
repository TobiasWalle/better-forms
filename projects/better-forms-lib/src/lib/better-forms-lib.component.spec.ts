import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetterFormsLibComponent } from './better-forms-lib.component';

describe('BetterFormsLibComponent', () => {
  let component: BetterFormsLibComponent;
  let fixture: ComponentFixture<BetterFormsLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetterFormsLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetterFormsLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
