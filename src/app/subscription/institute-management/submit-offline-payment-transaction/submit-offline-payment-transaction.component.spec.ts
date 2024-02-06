import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitOfflinePaymentTransactionComponent } from './submit-offline-payment-transaction.component';

describe('SubmitOfflinePaymentTransactionComponent', () => {
  let component: SubmitOfflinePaymentTransactionComponent;
  let fixture: ComponentFixture<SubmitOfflinePaymentTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitOfflinePaymentTransactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubmitOfflinePaymentTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
