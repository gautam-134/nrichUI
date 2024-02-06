import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteNotificationComponent } from './institute-notification.component';

describe('InstituteNotificationComponent', () => {
  let component: InstituteNotificationComponent;
  let fixture: ComponentFixture<InstituteNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituteNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstituteNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
