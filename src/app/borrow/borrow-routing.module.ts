import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BorrowListComponent } from './borrow-list/borrow-list.component';
import { BorrowRequestFormComponent } from './borrow-request-form/borrow-request-form.component';
import { BorrowApprovalsComponent } from './borrow-approvals/borrow-approvals.component';
import { RoleGuard } from '../guards/role.guard';

const routes: Routes = [
  { path: '', component: BorrowListComponent },
  { path: 'new', component: BorrowRequestFormComponent, canActivate: [RoleGuard], data: { roles: ['member'] } },
  { path: 'approvals', component: BorrowApprovalsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BorrowRoutingModule {}