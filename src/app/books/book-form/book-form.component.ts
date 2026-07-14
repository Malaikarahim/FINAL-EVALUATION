import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  isEditMode = false;
  bookId: number | null = null;
  submitted = false;
  saving = false;

  genres = ['Software Engineering', 'Science Fiction', 'History', 'Self Help', 'Fiction', 'Biography', 'Fantasy', 'Other'];
  form: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      available: [1, [Validators.required, Validators.min(0)]]
    });
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.bookId = Number(idParam);
      this.bookService.getBook(this.bookId).subscribe(book => {
        this.form.patchValue(book);
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    if (Number(value.available) > Number(value.quantity)) {
      this.form.controls['available'].setErrors({ exceedsQuantity: true });
      return;
    }

    this.saving = true;
    const payload = {
      title: value.title!,
      author: value.author!,
      genre: value.genre!,
      quantity: Number(value.quantity),
      available: Number(value.available)
    };

    const request$ = this.isEditMode
      ? this.bookService.updateBook({ id: this.bookId!, ...payload })
      : this.bookService.addBook(payload);

    request$.subscribe({
      next: () => {
        this.toast.success(this.isEditMode ? 'Book updated.' : 'Book added to catalog.');
        this.router.navigate(['/books']);
      },
      error: () => (this.saving = false)
    });
  }

  cancel(): void {
    this.router.navigate(['/books']);
  }
}
