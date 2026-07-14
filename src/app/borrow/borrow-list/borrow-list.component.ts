import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BorrowRecord } from '../../models/borrow-record.model';
import { BorrowRequest } from '../../models/borrow-request.model';
import { BorrowService } from '../../services/borrow.service';
import { BorrowRequestService } from '../../services/borrow-request.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

const FINE_PER_DAY = 2;

@Component({
  selector: 'app-borrow-list',
  templateUrl: './borrow-list.component.html',
  styleUrls: ['./borrow-list.component.css']
})
export class BorrowListComponent implements OnInit {
  records: BorrowRecord[] = [];
  pendingReturnRecordIds = new Set<number>();
  loaded = false;
  requestingReturnId: number | null = null;

  constructor(
    private borrowService: BorrowService,
    private requestService: BorrowRequestService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  isAdmin(): boolean {
    return this.auth.getRole() === 'admin';
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    forkJoin({
      records: this.borrowService.getRecords(),
      requests: this.requestService.getRequests()
    }).subscribe(({ records, requests }) => {
      const computed = this.withComputedStatus(records);
      const currentUserId = this.auth.currentUserValue?.id;
      this.records = this.isAdmin()
        ? computed
        : computed.filter(r => r.memberId === currentUserId);

      this.pendingReturnRecordIds = new Set(
        requests
          .filter(r => r.type === 'Return' && r.status === 'Pending')
          .map(r => r.borrowRecordId!)
      );

      this.loaded = true;
    });
  }

  private withComputedStatus(records: BorrowRecord[]): BorrowRecord[] {

  const today = new Date().toISOString().slice(0, 10);

  return records
    .map(record => {

      if (
        record.status !== 'Returned' &&
        record.dueDate < today
      ) {
        return {
          ...record,
          status: 'Overdue' as const
        };
      }

      return record;

    })

    .sort((a, b) =>
      new Date(b.issueDate).getTime() -
      new Date(a.issueDate).getTime()
    );

}
  private daysLate(dueDate: string, compareDate: string): number {
    const due = new Date(dueDate);
    const compare = new Date(compareDate);
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round((compare.getTime() - due.getTime()) / msPerDay);
  }

  private calculateFine(dueDate: string, compareDate: string): number {
    const late = this.daysLate(dueDate, compareDate);
    return late > 0 ? late * FINE_PER_DAY : 0;
  }

  getDisplayFine(record: BorrowRecord): number {
    if (record.status === 'Returned') {
      return record.fine ?? 0;
    }
    const today = new Date().toISOString().slice(0, 10);
    return this.calculateFine(record.dueDate, today);
  }

  hasPendingReturnRequest(record: BorrowRecord): boolean {
    return this.pendingReturnRecordIds.has(record.id);
  }

  requestReturn(record: BorrowRecord): void {
    if (this.isAdmin() || this.hasPendingReturnRequest(record)) return;

    this.requestingReturnId = record.id;
    const user = this.auth.currentUserValue;
    const payload: Partial<BorrowRequest> = {
      type: 'Return',
      bookId: record.bookId,
      bookTitle: record.bookTitle,
      memberId: user?.id!,
      memberName: user?.name!,
      requestDate: new Date().toISOString().slice(0, 10),
      borrowRecordId: record.id,
      status: 'Pending'
    };

    this.requestService.addRequest(payload).subscribe({
      next: () => {
        this.toast.success(`Return request sent for "${record.bookTitle}". Waiting for approval.`);
        this.requestingReturnId = null;
        this.loadAll();
      },
      error: () => {
        this.requestingReturnId = null;
        this.toast.error('Could not submit return request.');
      }
    });
  }
}