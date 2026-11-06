import { Component, input } from '@angular/core';

import { DuplicateBookGroup } from '../../../duplicates/models/duplicate-book-group.model';
import { DuplicateBookCard } from '../../../duplicates/components/duplicate-book-card/duplicate-book-card';

@Component({
  imports: [
    DuplicateBookCard
  ],
  selector: 'mbs-duplicates-carousel',
  styleUrl: './duplicates-carousel.scss',
  templateUrl: './duplicates-carousel.html',
})
export class DuplicatesCarousel {
  readonly groups = input.required<DuplicateBookGroup[]>();
}
