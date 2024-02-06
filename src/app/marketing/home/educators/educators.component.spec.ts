import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducatorsComponent } from './educators.component';

describe('EducatorsComponent', () => {
  let component: EducatorsComponent;
  let fixture: ComponentFixture<EducatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducatorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EducatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
