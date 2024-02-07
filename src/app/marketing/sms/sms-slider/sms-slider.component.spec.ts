import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsSliderComponent } from './sms-slider.component';

describe('SmsSliderComponent', () => {
  let component: SmsSliderComponent;
  let fixture: ComponentFixture<SmsSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsSliderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
