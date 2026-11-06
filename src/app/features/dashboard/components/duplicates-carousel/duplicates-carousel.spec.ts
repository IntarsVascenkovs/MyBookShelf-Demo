import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DuplicatesCarousel } from './duplicates-carousel';

describe('DuplicatesCarousel', () => {
  let component: DuplicatesCarousel;
  let fixture: ComponentFixture<DuplicatesCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicatesCarousel]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DuplicatesCarousel);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('groups', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
