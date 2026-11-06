import { Component, input } from '@angular/core';

import { DuplicateBookGroup } from '../../models/duplicate-book-group.model';

@Component({
  imports: [],
  selector: 'mbs-duplicate-book-card',
  styleUrl: './duplicate-book-card.scss',
  templateUrl: './duplicate-book-card.html',
})
export class DuplicateBookCard {
  readonly group = input.required<DuplicateBookGroup>();
}
