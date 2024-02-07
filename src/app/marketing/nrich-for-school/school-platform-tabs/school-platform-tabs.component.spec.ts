import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolPlatformTabsComponent } from './school-platform-tabs.component';

describe('SchoolPlatformTabsComponent', () => {
  let component: SchoolPlatformTabsComponent;
  let fixture: ComponentFixture<SchoolPlatformTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolPlatformTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchoolPlatformTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
