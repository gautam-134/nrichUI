import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClassConfigurationComponent } from './edit-class-configuration.component';

describe('EditClassConfigurationComponent', () => {
  let component: EditClassConfigurationComponent;
  let fixture: ComponentFixture<EditClassConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditClassConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditClassConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
