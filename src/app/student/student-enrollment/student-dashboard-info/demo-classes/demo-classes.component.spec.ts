import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoClassesComponent } from './demo-classes.component';

describe('DemoClassesComponent', () => {
  let component: DemoClassesComponent;
  let fixture: ComponentFixture<DemoClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoClassesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemoClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
