import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassConfigurationComponent } from './class-configuration.component';

describe('ClassConfigurationComponent', () => {
  let component: ClassConfigurationComponent;
  let fixture: ComponentFixture<ClassConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
