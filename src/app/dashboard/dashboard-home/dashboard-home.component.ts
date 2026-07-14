import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BookService } from '../../services/book.service';
import { MemberService } from '../../services/member.service';
import { BorrowService } from '../../services/borrow.service';
import { BorrowRequestService } from '../../services/borrow-request.service';
import { AuthService } from '../../services/auth.service';
import { BorrowRecord } from '../../models/borrow-record.model';


@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {

  loaded = false;

totalBooks = 0;
totalCopies = 0;
availableCopies = 0;

borrowedCopies = 0;
overdueCount = 0;

totalMembers = 0;

// Member Dashboard
myBorrowedBooks = 0;
myPendingRequests = 0;

  recentActivity: {
    label: string;
    detail: string;
    status: string;
  }[] = [];

  constructor(
  private bookService: BookService,
  private memberService: MemberService,
  private borrowService: BorrowService,
  private borrowRequestService: BorrowRequestService,
  public auth: AuthService
) {}

  ngOnInit(): void {

    forkJoin({
  books: this.bookService.getBooks(),
  members: this.memberService.getMembers(),
  records: this.borrowService.getRecords(),
  requests: this.borrowRequestService.getRequests()
}).subscribe(({ books, members, records, requests }) => {

      const today = new Date().toISOString().slice(0, 10);

const computedRecords = records
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
      // Debug (remove later if you want)
      console.log('Borrow Records:', computedRecords);

      // Dashboard Cards
      this.totalBooks = books.length;

      this.totalMembers = members.length;

      this.totalCopies = books.reduce(
        (sum, book) => sum + book.quantity,
        0
      );

      this.availableCopies = books.reduce(
        (sum, book) => sum + book.available,
        0
      );

      if (this.auth.getRole() === 'admin') {

  this.borrowedCopies =
    this.borrowService.getBorrowedCount(computedRecords);

  this.overdueCount =
    this.borrowService.getOverdueCount(computedRecords);

} else {

  const myRecords = computedRecords.filter(
    r => r.memberId === this.auth.currentUserValue?.id
  );

  this.myBorrowedBooks = myRecords.filter(
    r => r.status !== 'Returned'
  ).length;

  this.myPendingRequests = requests.filter(
    r =>
      r.memberId === this.auth.currentUserValue?.id &&
      r.status === 'Pending'
  ).length;

}

      // Recent Activity

const activityRecords =
  this.auth.getRole() === 'admin'
    ? computedRecords
    : computedRecords.filter(
        r => r.memberId === this.auth.currentUserValue?.id
      );

this.recentActivity = activityRecords

  .sort(
    (a, b) => {

      const dateA = a.returnDate
        ? new Date(a.returnDate).getTime()
        : new Date(a.issueDate).getTime();

      const dateB = b.returnDate
        ? new Date(b.returnDate).getTime()
        : new Date(b.issueDate).getTime();

      return dateB - dateA;

    }
  )

  .slice(0, 5)

  .map(record => ({

    label:
      this.auth.getRole() === 'admin'
        ? `${record.bookTitle} → ${record.memberName}`
        : record.bookTitle,

    detail:
      record.status === 'Returned'
        ? `Returned ${record.returnDate}`
        : `Due ${record.dueDate}`,

    status: record.status

  }));
      this.loaded = true;

    });

  }

}