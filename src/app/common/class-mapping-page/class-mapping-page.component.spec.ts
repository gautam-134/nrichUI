import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassMappingPageComponent } from './class-mapping-page.component';

describe('ClassMappingPageComponent', () => {
  let component: ClassMappingPageComponent;
  let fixture: ComponentFixture<ClassMappingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassMappingPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassMappingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
