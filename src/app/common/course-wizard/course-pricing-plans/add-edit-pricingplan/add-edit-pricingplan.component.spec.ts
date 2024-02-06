import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPricingplanComponent } from './add-edit-pricingplan.component';

describe('AddEditPricingplanComponent', () => {
  let component: AddEditPricingplanComponent;
  let fixture: ComponentFixture<AddEditPricingplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditPricingplanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditPricingplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
