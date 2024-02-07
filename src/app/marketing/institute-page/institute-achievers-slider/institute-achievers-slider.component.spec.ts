import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteAchieversSliderComponent } from './institute-achievers-slider.component';

describe('InstituteAchieversSliderComponent', () => {
  let component: InstituteAchieversSliderComponent;
  let fixture: ComponentFixture<InstituteAchieversSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituteAchieversSliderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstituteAchieversSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
