import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesProgress } from './series-progress';

describe('SeriesProgress', () => {
  let component: SeriesProgress;
  let fixture: ComponentFixture<SeriesProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriesProgress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesProgress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
