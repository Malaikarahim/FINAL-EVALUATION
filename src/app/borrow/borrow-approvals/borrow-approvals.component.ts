import { Component, OnInit } from '@angular/core';
import { BorrowRequest } from '../../models/borrow-request.model';
import { BorrowRecord } from '../../models/borrow-record.model';
import { Book } from '../../models/book.model';
import { BorrowRequestService } from '../../services/borrow-request.service';
import { BookService } from '../../services/book.service';
import { BorrowService } from '../../services/borrow.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

const RESERVED_COPIES = 1;
const FINE_PER_DAY = 2;

@Component({
  selector: 'app-borrow-approvals',
  templateUrl: './borrow-approvals.component.html',
  styleUrls: ['./borrow-approvals.component.css']
})
export class BorrowApprovalsComponent implements OnInit {
  requests: BorrowRequest[] = [];
  books: Book[] = [];
  loaded = false;
  processingId: number | null = null;

  constructor(
    private requestService: BorrowRequestService,
    private bookService: BookService,
    private borrowService: BorrowService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchAll();
  }

  isAdmin(): boolean {
    return this.auth.getRole() === 'admin';
  }

  fetchAll(): void {
    this.requestService.getRequests().subscribe(requests => {
      const currentUserId = this.auth.currentUserValue?.id;
      this.requests = (this.isAdmin() ? requests : requests.filter(r => r.memberId === currentUserId))
        .sort((a, b) => b.id - a.id);
      this.loaded = true;
    });
    this.bookService.getBooks().subscribe(books => this.books = books);
  }

  approve(request: BorrowRequest): void {
    if (this.processingId) return;
    request.type === 'Borrow' ? this.approveBorrow(request) : this.approveReturn(request);
  }

  reject(request: BorrowRequest): void {
    if (this.processingId) return;
    this.updateStatus(request, 'Rejected');
  }

  private approveBorrow(request: BorrowRequest): void {
    const book = this.books.find(b => b.id === request.bookId);
    if (!book) { this.toast.error('This book no longer exists.'); return; }
    if (book.available <= RESERVED_COPIES) { this.toast.error('No lendable copies left for this title.'); return; }

    this.processingId = request.id;
    const record: Partial<BorrowRecord> = {
      bookId: book.id,
      bookTitle: book.title,
      memberId: request.memberId,
      memberName: request.memberName,
      issueDate: request.issueDate!,
      dueDate: request.dueDate!,
      returnDate: null,
      status: 'Issued'
    };

    this.borrowService.issueBook(record).subscribe(() => {
      this.bookService.updateBook({ ...book, available: book.available - 1 }).subscribe(() => {
        this.updateStatus(request, 'Approved', () => {
          this.toast.success(`"${book.title}" issued to ${request.memberName}.`);
        });
      });
    });
  }

  private approveReturn(request: BorrowRequest): void {
    this.processingId = request.id;
    this.borrowService.getRecords().subscribe(records => {
      const record = records.find(r => r.id === request.borrowRecordId);
      if (!record) { this.toast.error('Original borrow record not found.'); this.processingId = null; return; }

      const book = this.books.find(b => b.id === record.bookId);
      const today = new Date().toISOString().slice(0, 10);
      const fine = this.calculateFine(record.dueDate, today);
      const updatedRecord: BorrowRecord = { ...record, status: 'Returned', returnDate: today, fine };

      this.borrowService.returnBook(updatedRecord).subscribe(() => {
        const afterBookUpdate = () => {
          this.updateStatus(request, 'Approved', () => {
            this.toast.success(
              fine > 0
                ? `"${record.bookTitle}" returned. Fine: ₹${fine}.`
                : `"${record.bookTitle}" returned on time. No fine.`
            );
          });
        };
        if (book) {
          this.bookService.updateBook({ ...book, available: book.available + 1 }).subscribe(afterBookUpdate);
        } else {
          afterBookUpdate();
        }
      });
    });
  }

  private calculateFine(dueDate: string, returnDate: string): number {
    const due = new Date(dueDate);
    const ret = new Date(returnDate);
    const msPerDay = 1000 * 60 * 60 * 24;
    const late = Math.round((ret.getTime() - due.getTime()) / msPerDay);
    return late > 0 ? late * FINE_PER_DAY : 0;
  }

  private updateStatus(request: BorrowRequest, status: 'Approved' | 'Rejected', onDone?: () => void): void {
    const updated: BorrowRequest = { ...request, status };
    this.requestService.updateRequest(updated).subscribe(() => {
      const idx = this.requests.findIndex(r => r.id === request.id);
      if (idx > -1) this.requests[idx] = updated;
      this.processingId = null;
      if (onDone) onDone(); else this.toast.success(`Request ${status.toLowerCase()}.`);
    });
  }
}