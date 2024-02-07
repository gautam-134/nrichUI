import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsSearchComponent } from './sms-search.component';

describe('SmsSearchComponent', () => {
  let component: SmsSearchComponent;
  let fixture: ComponentFixture<SmsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
