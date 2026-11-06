import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { z } from 'zod';

import { BookDialogService } from '../../services/book-dialog.service';
import {
  BOOK_CONDITION, BOOK_ISSUE,
  BOOK_STATUS,
  BookCondition,
  BookIssue,
  BookStatus
} from '../../../../core/constants/book.constants';
import { Language, LANGUAGE, LANGUAGE_LABELS } from '../../../../core/constants/language.constants';
import { CreateBook, CreateBookSchema } from '../../../../core/models/book.model';
import { DisplayLabelPipe } from '../../../../shared/pipes/display-label-pipe';
import { BooksService } from '../../services/books.service';

@Component({
  imports: [
    ReactiveFormsModule,
    DisplayLabelPipe,
  ],
  selector: 'mbs-book-form-dialog',
  styleUrl: './book-form-dialog.scss',
  templateUrl: './book-form-dialog.html',
})
export class BookFormDialog {
  protected readonly dialogService = inject(BookDialogService);
  protected readonly booksService = inject(BooksService);

  protected readonly fieldErrors = signal<Partial<Record<keyof CreateBook, string[]>>>({});

  protected readonly statuses = Object.values(BOOK_STATUS);
  protected readonly conditions = Object.values(BOOK_CONDITION);
  protected readonly issues = Object.values(BOOK_ISSUE);
  protected readonly languages = Object.values(LANGUAGE);
  protected readonly languageLabels = LANGUAGE_LABELS;

  protected readonly editingBook = this.dialogService.editingBook();

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.fieldErrors.set({})
      });
  }

  protected readonly form = new FormGroup({
    title: new FormControl(this.editingBook?.title ?? '', {
      nonNullable: true,
      validators: [ Validators.required ],
    }),
    author: new FormControl(this.editingBook?.author ?? '', {
      nonNullable: true,
      validators: [ Validators.required ],
    }),
    publicationYear: new FormControl<number | null>(this.editingBook?.publicationYear ?? null),
    language: new FormControl<Language>(this.editingBook?.language ?? LANGUAGE.ENGLISH, {
      nonNullable: true,
      validators: [ Validators.required ],
    }),
    languageDetails: new FormControl(this.editingBook?.languageDetails ?? '', { nonNullable: true }),
    isbn: new FormControl(this.editingBook?.isbn ?? '', { nonNullable: true }),
    description: new FormControl(this.editingBook?.description ?? '', { nonNullable: true }),
    imageUrl: new FormControl(this.editingBook?.imageUrl ?? '', { nonNullable: true }),
    condition: new FormControl<BookCondition>(this.editingBook?.condition ?? BOOK_CONDITION.GOOD, {
      nonNullable: true,
      validators: [ Validators.required ],
    }),
    status: new FormControl<BookStatus>(
      this.editingBook?.status ?? this.dialogService.initialStatus(),
      {
        nonNullable: true,
        validators: [ Validators.required ],
      }
    ),
    issues: new FormControl<BookIssue[]>(
      [ ...(this.editingBook?.issues ?? []) ],
      { nonNullable: true }),
  });

  protected isIssueSelected(issue: BookIssue): boolean {
    return this.form.controls.issues.value.includes(issue);
  }

  protected toggleIssue(issue: BookIssue, checked: boolean): void {
    const control = this.form.controls.issues;

    control.setValue(
      checked
        ? [ ...new Set([ ...control.value, issue ]) ]
        : control.value.filter((item => item !== issue))
    );

    control.markAsTouched();
  }

  protected submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.getRawValue();

    const bookData = {
      ...formValue,
      publicationYear: formValue.publicationYear ?? undefined,
      isbn: formValue.isbn.trim() || undefined,
      description: formValue.description.trim() || undefined,
      imageUrl: formValue.imageUrl.trim() || undefined,
      languageDetails: formValue.languageDetails.trim() || undefined,
      issues: formValue.issues.length ? formValue.issues : undefined,
    }

    const result = CreateBookSchema.safeParse(bookData);

    if (!result.success) {
      this.fieldErrors.set(z.flattenError(result.error).fieldErrors);
      return;
    }
    this.fieldErrors.set({});


    if (this.editingBook) {
      const updatedBook = this.booksService.updateBook(
        this.editingBook.id,
        result.data,
      );

      if (!updatedBook) {
        console.error('Book not found:', this.editingBook.id);
        return;
      }

      console.log('Book updated:', updatedBook);
    } else {
      const createdBook = this.booksService.addBook(result.data);
      console.log('Book created: ', createdBook);
    }

    this.dialogService.close();
  }

  protected closeDialog(): void {
    this.dialogService.close();
  }
}
