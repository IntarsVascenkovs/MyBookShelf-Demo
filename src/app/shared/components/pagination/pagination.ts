import { Component, input, output, computed } from '@angular/core';

@Component({
  imports: [],
  selector: 'mbs-pagination',
  styleUrl: './pagination.scss',
  templateUrl: './pagination.html',
})
export class Pagination {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();

  readonly pageRequested = output<number>();

  protected emitPage(page: number) {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.pageRequested.emit(page);
  }

  protected readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    const visibleCount = Math.min(5, Math.max(0, total - 2));

    const start = Math.max(2, Math.min(current - 2, total - visibleCount));

    return Array.from(
      { length: visibleCount },
      (_, index) => start + index
    );
  });

  protected readonly showLeadingEllipsis = computed(() =>
    this.pages().length > 0 && this.pages()[0] > 2
  );

  protected readonly showTrailingEllipsis = computed(() => {
    const pages = this.pages();
    return pages.length > 0 && pages[pages.length - 1] < this.totalPages() - 1;
  });
}
