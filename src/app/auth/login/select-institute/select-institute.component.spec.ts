import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInstituteComponent } from './select-institute.component';

describe('SelectInstituteComponent', () => {
  let component: SelectInstituteComponent;
  let fixture: ComponentFixture<SelectInstituteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectInstituteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
