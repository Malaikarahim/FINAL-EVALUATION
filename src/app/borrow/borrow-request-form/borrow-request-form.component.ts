import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BorrowRequestService } from '../../services/borrow-request.service';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Book } from '../../models/book.model';

const RESERVED_COPIES = 1;
const MAX_DUE_DAYS = 14; // 7 karna ho to yahan badal dein

@Component({
  selector: 'app-borrow-request-form',
  templateUrl: './borrow-request-form.component.html',
  styleUrls: ['./borrow-request-form.component.css']
})
export class BorrowRequestFormComponent implements OnInit {
  form: FormGroup;
  submitting = false;
  submitted = false;
  books: Book[] = [];
  loaded = false;

  constructor(
    private fb: FormBuilder,
    private requestService: BorrowRequestService,
    private bookService: BookService,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    const today = this.todayStr();
    this.form = this.fb.group(
      {
        bookId: [null as number | null, Validators.required],
        issueDate: [today, Validators.required],
        dueDate: ['', Validators.required]
      },
      { validators: this.dueDateRangeValidator }
    );
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
      this.loaded = true;
    });
  }

  private todayStr(): string {
    return new Date().toISOString().slice(0, 10);
  }

  get availableBooks(): Book[] {
    return this.books.filter(b => b.available > RESERVED_COPIES);
  }

  get selectedBook(): Book | undefined {
    const id = this.form.get('bookId')?.value;
    return this.books.find(b => b.id === id);
  }

  get minIssueDate(): string {
    return this.todayStr();
  }

  get minDueDate(): string {
    return this.form.get('issueDate')?.value || this.minIssueDate;
  }

  get maxDueDate(): string {
    const issue = this.form.get('issueDate')?.value || this.minIssueDate;
    const d = new Date(issue);
    d.setDate(d.getDate() + MAX_DUE_DAYS);
    return d.toISOString().slice(0, 10);
  }

  private dueDateRangeValidator = (group: AbstractControl): ValidationErrors | null => {
    const issueDate = group.get('issueDate')?.value;
    const dueDate = group.get('dueDate')?.value;
    if (!issueDate || !dueDate) return null;

    if (dueDate < issueDate) return { dueBeforeIssue: true };

    const max = new Date(issueDate);
    max.setDate(max.getDate() + MAX_DUE_DAYS);
    const maxStr = max.toISOString().slice(0, 10);

    if (dueDate > maxStr) return { dueTooFar: true };
    return null;
  };

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const book = this.selectedBook;
    if (!book) return;

    if (book.available <= RESERVED_COPIES) {
      this.toast.error('This title has no lendable copies left right now.');
      return;
    }

    this.submitting = true;
    const user = this.auth.currentUserValue;
    const { bookId, issueDate, dueDate } = this.form.getRawValue();

    const payload: Partial<import('../../models/borrow-request.model').BorrowRequest> = {
      type: 'Borrow',
      bookId,
      bookTitle: book.title,
      memberId: user?.id,
      memberName: user?.name,
      requestDate: this.todayStr(),
      issueDate,
      dueDate,
      status: 'Pending'
    };

    this.requestService.addRequest(payload).subscribe({
      next: () => {
        this.toast.success('Borrow request sent to the librarian for approval.');
        this.router.navigate(['/borrow']);
      },
      error: () => {
        this.submitting = false;
        this.toast.error('Could not submit request.');
      }
    });
  }
}