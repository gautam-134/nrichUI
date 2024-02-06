import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClassInConfigurationComponent } from './add-class-in-configuration.component';

describe('AddClassInConfigurationComponent', () => {
  let component: AddClassInConfigurationComponent;
  let fixture: ComponentFixture<AddClassInConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddClassInConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddClassInConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
