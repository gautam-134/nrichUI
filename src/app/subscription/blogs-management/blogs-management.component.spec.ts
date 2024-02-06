import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsManagementComponent } from './blogs-management.component';

describe('BlogsManagementComponent', () => {
  let component: BlogsManagementComponent;
  let fixture: ComponentFixture<BlogsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogsManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlogsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
