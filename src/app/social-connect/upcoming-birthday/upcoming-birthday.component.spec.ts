import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingBirthdayComponent } from './upcoming-birthday.component';

describe('UpcomingBirthdayComponent', () => {
  let component: UpcomingBirthdayComponent;
  let fixture: ComponentFixture<UpcomingBirthdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingBirthdayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpcomingBirthdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
