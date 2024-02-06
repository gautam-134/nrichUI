import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineEnrollmentComponent } from './offline-enrollment.component';

describe('OfflineEnrollmentComponent', () => {
  let component: OfflineEnrollmentComponent;
  let fixture: ComponentFixture<OfflineEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfflineEnrollmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OfflineEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
