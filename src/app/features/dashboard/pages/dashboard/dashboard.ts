import { Component, inject } from '@angular/core';

import { DuplicatesCarousel } from '../../components/duplicates-carousel/duplicates-carousel';
import { BooksService } from '../../../books/services/books.service';
import { DuplicatesService } from '../../../duplicates/services/duplicates.service';
import { SeriesServices } from '../../../series/services/series.services';
import { WishlistService } from '../../../wishlist/services/wishlist.service';

@Component({
  selector: 'mbs-dashboard',
  imports: [ DuplicatesCarousel ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly booksService = inject(BooksService);
  private readonly duplicatesService = inject(DuplicatesService);
  private readonly seriesService = inject(SeriesServices);
  private readonly wishlistService = inject(WishlistService);

  protected readonly duplicateGroups = this.duplicatesService.duplicateGroups;
  protected readonly duplicateBooksCount = this.duplicatesService.duplicateBooksCount;
  protected readonly incompleteSeries = this.seriesService.incompleteSeries;
  protected readonly totalBooks = this.booksService.totalBooks;
  protected readonly wishlistBooks = this.wishlistService.wishlistBooks;
}
