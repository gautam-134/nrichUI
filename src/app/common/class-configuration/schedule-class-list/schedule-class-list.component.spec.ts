import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleClassListComponent } from './schedule-class-list.component';

describe('ScheduleClassListComponent', () => {
  let component: ScheduleClassListComponent;
  let fixture: ComponentFixture<ScheduleClassListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleClassListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduleClassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
