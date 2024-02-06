import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrerecordedModulesComponent } from './prerecorded-modules.component';

describe('PrerecordedModulesComponent', () => {
  let component: PrerecordedModulesComponent;
  let fixture: ComponentFixture<PrerecordedModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrerecordedModulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrerecordedModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
