import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInstituteNotificationComponent } from './create-institute-notification.component';

describe('CreateInstituteNotificationComponent', () => {
  let component: CreateInstituteNotificationComponent;
  let fixture: ComponentFixture<CreateInstituteNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInstituteNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateInstituteNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
