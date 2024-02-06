import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteFilterComponent } from './institute-filter.component';

describe('InstituteFilterComponent', () => {
  let component: InstituteFilterComponent;
  let fixture: ComponentFixture<InstituteFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituteFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstituteFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
