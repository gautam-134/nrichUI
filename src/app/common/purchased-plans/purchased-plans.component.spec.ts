import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedPlansComponent } from './purchased-plans.component';

describe('PurchasedPlansComponent', () => {
  let component: PurchasedPlansComponent;
  let fixture: ComponentFixture<PurchasedPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasedPlansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchasedPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
