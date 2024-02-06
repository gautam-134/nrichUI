import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAllAssignmentsComponent } from './admin-all-assignments.component';

describe('AdminAllAssignmentsComponent', () => {
  let component: AdminAllAssignmentsComponent;
  let fixture: ComponentFixture<AdminAllAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAllAssignmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAllAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
