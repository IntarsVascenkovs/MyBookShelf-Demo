import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookFormDialog } from './book-form-dialog';

describe('BookFormDialog', () => {
  let component: BookFormDialog;
  let fixture: ComponentFixture<BookFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookFormDialog]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BookFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
