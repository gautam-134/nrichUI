import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInstituteBlogsComponent } from './manage-institute-blogs.component';

describe('ManageInstituteBlogsComponent', () => {
  let component: ManageInstituteBlogsComponent;
  let fixture: ComponentFixture<ManageInstituteBlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageInstituteBlogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageInstituteBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
