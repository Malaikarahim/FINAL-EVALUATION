import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BooksRoutingModule } from './books-routing.module';
import { BookListComponent } from './book-list/book-list.component';
import { BookFormComponent } from './book-form/book-form.component';

@NgModule({
  declarations: [BookListComponent, BookFormComponent],
  imports: [SharedModule, BooksRoutingModule]
})
export class BooksModule {}
