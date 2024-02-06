import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifiedInstitutesComponent } from './notified-institutes.component';

describe('NotifiedInstitutesComponent', () => {
  let component: NotifiedInstitutesComponent;
  let fixture: ComponentFixture<NotifiedInstitutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifiedInstitutesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotifiedInstitutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
