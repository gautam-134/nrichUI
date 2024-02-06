import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseBatchesComponent } from './course-batches.component';

describe('CourseBatchesComponent', () => {
  let component: CourseBatchesComponent;
  let fixture: ComponentFixture<CourseBatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseBatchesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourseBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
