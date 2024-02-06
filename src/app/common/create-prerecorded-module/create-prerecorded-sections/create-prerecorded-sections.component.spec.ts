import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePrerecordedSectionsComponent } from './create-prerecorded-sections.component';

describe('CreatePrerecordedSectionsComponent', () => {
  let component: CreatePrerecordedSectionsComponent;
  let fixture: ComponentFixture<CreatePrerecordedSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePrerecordedSectionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatePrerecordedSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
