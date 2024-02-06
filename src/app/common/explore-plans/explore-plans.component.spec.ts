import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorePlansComponent } from './explore-plans.component';

describe('ExplorePlansComponent', () => {
  let component: ExplorePlansComponent;
  let fixture: ComponentFixture<ExplorePlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorePlansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExplorePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
