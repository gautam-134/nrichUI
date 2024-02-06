import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducatorFilterComponent } from './educator-filter.component';

describe('EducatorFilterComponent', () => {
  let component: EducatorFilterComponent;
  let fixture: ComponentFixture<EducatorFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducatorFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EducatorFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
