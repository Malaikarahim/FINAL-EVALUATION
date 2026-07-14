import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BookFormComponent } from './book-form/book-form.component';
import { RoleGuard } from '../guards/role.guard';

const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'new', component: BookFormComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
  { path: ':id/edit', component: BookFormComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule {}
