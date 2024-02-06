import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSliderComponent } from './team-slider.component';

describe('TeamSliderComponent', () => {
  let component: TeamSliderComponent;
  let fixture: ComponentFixture<TeamSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamSliderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
