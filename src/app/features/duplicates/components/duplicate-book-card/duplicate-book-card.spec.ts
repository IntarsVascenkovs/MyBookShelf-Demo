import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DuplicateBookCard } from './duplicate-book-card';
import { DuplicateBookGroup } from '../../models/duplicate-book-group.model';

describe('DuplicateBookCard', () => {
  let component: DuplicateBookCard;
  let fixture: ComponentFixture<DuplicateBookCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicateBookCard]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DuplicateBookCard);
    component = fixture.componentInstance;
    const group: DuplicateBookGroup = {
      title: 'Dune',
      author: 'Frank Herbert',
      bookIds: ['book-1', 'book-2'],
    };
    fixture.componentRef.setInput('group', group);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
