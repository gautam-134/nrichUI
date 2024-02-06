import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInstituteComponent } from './add-edit-institute.component';

describe('AddEditInstituteComponent', () => {
  let component: AddEditInstituteComponent;
  let fixture: ComponentFixture<AddEditInstituteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditInstituteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
