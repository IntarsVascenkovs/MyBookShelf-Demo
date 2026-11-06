import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCard } from './book-card';
import { Book } from '../../../../core/models/book.model';

describe('BookCard', () => {
  let component: BookCard;
  let fixture: ComponentFixture<BookCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookCard);
    component = fixture.componentInstance;
    const book: Book = {
      id: 'test-book',
      title: 'Dune',
      author: 'Frank Herbert',
      language: 'en',
      condition: 'good',
      status: 'owned',
      createdAt: '2026-01-01',
    };
    fixture.componentRef.setInput('book', book);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
