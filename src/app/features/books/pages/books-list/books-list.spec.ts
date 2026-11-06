import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Book } from '../../../../core/models/book.model';
import { BooksService } from '../../services/books.service';
import { BooksList } from './books-list';

const book: Book = {
  id: '039546bd-f668-52b6-b456-87421014655f',
  title: 'Dune',
  author: 'Frank Herbert',
  publicationYear: 1965,
  language: 'en',
  condition: 'good',
  status: 'owned',
  createdAt: '2023-01-01T00:00:00Z',
};

describe('BooksList', () => {
  let fixture: ComponentFixture<BooksList>;
  let page: HTMLElement;

  function visibleTitles(): string[] {
    return Array.from(page.querySelectorAll('tbody tr td:nth-child(2)'),
      (cell) => cell.textContent.trim());
  }

  function clickButton(label: string, scope = 'button'): void {
    const button = Array.from(page.querySelectorAll<HTMLButtonElement>(scope))
      .find((candidate) => candidate.textContent.trim() === label);
    if (!button) throw new Error(`Button not found: ${label}`);
    button.click();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    const books = signal<Book[]>([
      { ...book, id: 'z', title: 'Zeta', author: 'Zoe Lane', publicationYear: 999 },
      book,
      { ...book, id: 'a', title: 'Children of Dune', publicationYear: 1976, status: 'wishlist' },
    ]);
    await TestBed.configureTestingModule({
      imports: [BooksList],
      providers: [{
        provide: BooksService,
        useValue: {
          books: books.asReadonly(),
          deleteBook: (id: string) => {
            books.update((collection) => collection.filter((entry) => entry.id !== id));
            return true;
          },
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksList);
    fixture.componentInstance.pageSize.set(2);
    page = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('filters by trimmed, case-insensitive title or author and combines search with status', () => {
    const search = page.querySelector<HTMLInputElement>('input[type="search"]')!;
    const status = page.querySelector<HTMLSelectElement>('select')!;
    clickButton('Next');

    search.value = '  DuNE  ';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(visibleTitles()).toEqual(['Children of Dune', 'Dune']);
    expect(page.querySelector('[aria-current="page"]')?.textContent.trim()).toBe('1');

    search.value = 'HERBERT';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(visibleTitles()).toEqual(['Children of Dune', 'Dune']);

    status.value = 'wishlist';
    status.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(visibleTitles()).toEqual(['Children of Dune']);

    status.value = 'lent-out';
    status.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(page.querySelector('tbody')?.textContent).toContain('No books found.');
  });

  it('toggles title sorting and switches to ascending numeric year sorting', () => {
    const headers = page.querySelectorAll<HTMLButtonElement>('thead button');
    expect(visibleTitles()).toEqual(['Children of Dune', 'Dune']);

    headers[0].click();
    fixture.detectChanges();
    expect(visibleTitles()).toEqual(['Zeta', 'Dune']);

    clickButton('Next');
    headers[2].click();
    fixture.detectChanges();
    expect(visibleTitles()).toEqual(['Zeta', 'Dune']);
    expect(page.querySelector('[aria-current="page"]')?.textContent.trim()).toBe('1');

    headers[2].click();
    fixture.detectChanges();
    expect(visibleTitles()).toEqual(['Children of Dune', 'Dune']);
  });

  it('shows the right slice when navigating between pages', () => {
    expect(visibleTitles()).toEqual(['Children of Dune', 'Dune']);

    clickButton('Next');
    expect(visibleTitles()).toEqual(['Zeta']);
    expect(page.querySelector('[aria-current="page"]')?.textContent.trim()).toBe('2');

    clickButton('Previous');
    expect(visibleTitles()).toEqual(['Children of Dune', 'Dune']);
  });

  it('shows the previous page after confirming deletion of the last book on the final page', () => {
    clickButton('Next');
    const deleteButton = page.querySelector<HTMLButtonElement>('button[aria-label="Delete Zeta"]')!;
    deleteButton.click();
    fixture.detectChanges();

    const dialog = page.querySelector('[role="alertdialog"]');
    expect(dialog?.textContent).toContain('Zeta');
    clickButton('Delete', '[role="alertdialog"] button');

    expect(page.querySelector('[role="alertdialog"]')).toBeNull();
    expect(page.querySelector('mbs-pagination')?.textContent).toContain('Page 1 of 1');
    expect(visibleTitles()).toEqual(['Children of Dune', 'Dune']);
  });
});
