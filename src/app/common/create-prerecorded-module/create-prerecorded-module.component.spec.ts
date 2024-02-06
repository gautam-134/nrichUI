import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePrerecordedModuleComponent } from './create-prerecorded-module.component';

describe('CreatePrerecordedModuleComponent', () => {
  let component: CreatePrerecordedModuleComponent;
  let fixture: ComponentFixture<CreatePrerecordedModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePrerecordedModuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatePrerecordedModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
