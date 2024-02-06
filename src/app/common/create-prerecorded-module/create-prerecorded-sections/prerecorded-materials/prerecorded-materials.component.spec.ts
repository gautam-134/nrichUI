import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrerecordedMaterialsComponent } from './prerecorded-materials.component';

describe('PrerecordedMaterialsComponent', () => {
  let component: PrerecordedMaterialsComponent;
  let fixture: ComponentFixture<PrerecordedMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrerecordedMaterialsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrerecordedMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
