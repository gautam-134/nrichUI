import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllfeaturesComponent } from './allfeatures.component';

describe('AllfeaturesComponent', () => {
  let component: AllfeaturesComponent;
  let fixture: ComponentFixture<AllfeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllfeaturesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllfeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
