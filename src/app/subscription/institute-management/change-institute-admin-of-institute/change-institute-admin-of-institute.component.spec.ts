import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeInstituteAdminOfInstituteComponent } from './change-institute-admin-of-institute.component';

describe('ChangeInstituteAdminOfInstituteComponent', () => {
  let component: ChangeInstituteAdminOfInstituteComponent;
  let fixture: ComponentFixture<ChangeInstituteAdminOfInstituteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeInstituteAdminOfInstituteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeInstituteAdminOfInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
