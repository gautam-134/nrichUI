import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditClassConfigurationComponent } from './create-edit-class-configuration.component';

describe('CreateEditClassConfigurationComponent', () => {
  let component: CreateEditClassConfigurationComponent;
  let fixture: ComponentFixture<CreateEditClassConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditClassConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEditClassConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
