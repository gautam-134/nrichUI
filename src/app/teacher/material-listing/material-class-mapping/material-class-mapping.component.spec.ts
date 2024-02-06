import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialClassMappingComponent } from './material-class-mapping.component';

describe('MaterialClassMappingComponent', () => {
  let component: MaterialClassMappingComponent;
  let fixture: ComponentFixture<MaterialClassMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialClassMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialClassMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
