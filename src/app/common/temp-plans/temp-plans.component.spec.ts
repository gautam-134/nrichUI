import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempPlansComponent } from './temp-plans.component';

describe('TempPlansComponent', () => {
  let component: TempPlansComponent;
  let fixture: ComponentFixture<TempPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempPlansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TempPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
