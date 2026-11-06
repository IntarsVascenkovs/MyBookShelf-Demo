import { TestBed } from '@angular/core/testing';
import { BookDialogService } from './book-dialog.service';

describe('BookDialogServicesTs', () => {
  let service: BookDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
