import { Component, OnInit } from '@angular/core';
import { BookRequest } from '../../models/book-request.model';
import { BookRequestService } from '../../services/book-request.service';
import { BookService } from '../../services/book.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {
  requests: BookRequest[] = [];
  loaded = false;

  constructor(
    private requestService: BookRequestService,
    private bookService: BookService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.requestService.getRequests().subscribe(requests => {
      const currentUserId = this.auth.currentUserValue?.id;
      this.requests = this.isAdmin()
        ? requests
        : requests.filter(r => r.memberId === currentUserId);
      this.loaded = true;
    });
  }

  isAdmin(): boolean {
    return this.auth.getRole() === 'admin';
  }

  approve(request: BookRequest): void {
    this.bookService.addBook({
      title: request.title,
      author: request.author || 'Unknown',
      genre: 'General',
      quantity: 1,
      available: 1
    }).subscribe({
      next: () => {
        this.updateStatus(request, 'Approved', true);
      },
      error: () => {
        this.toast.error('Could not add book to catalog.');
      }
    });
  }

  reject(request: BookRequest): void {
    this.updateStatus(request, 'Rejected', false);
  }

  private updateStatus(request: BookRequest, status: 'Approved' | 'Rejected', bookAdded: boolean): void {
    const updated: BookRequest = { ...request, status };
    this.requestService.updateRequest(updated).subscribe(() => {
      const idx = this.requests.findIndex(r => r.id === request.id);
      if (idx > -1) this.requests[idx] = updated;
      this.toast.success(
        bookAdded
          ? 'Request approved and book added to catalog.'
          : `Request ${status.toLowerCase()}.`
      );
    });
  }
}