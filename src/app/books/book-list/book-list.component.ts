import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  searchTerm = '';
  loaded = false;
  confirmingDeleteId: number | null = null;

  constructor(
    private bookService: BookService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
      this.loaded = true;
    });
  }

  askDelete(id: number): void {
    this.confirmingDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmingDeleteId = null;
  }

  confirmDelete(): void {
    if (this.confirmingDeleteId == null) return;
    const id = this.confirmingDeleteId;
    this.bookService.deleteBook(id).subscribe(() => {
      this.books = this.books.filter(b => b.id !== id);
      this.toast.success('Book removed from catalog.');
      this.confirmingDeleteId = null;
    });
  }

  isAdmin(): boolean {
    return this.auth.getRole() === 'admin';
  }
}
