import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BorrowRoutingModule } from './borrow-routing.module';
import { BorrowListComponent } from './borrow-list/borrow-list.component';
import { BorrowRequestFormComponent } from './borrow-request-form/borrow-request-form.component';
import { BorrowApprovalsComponent } from './borrow-approvals/borrow-approvals.component';

@NgModule({
  declarations: [BorrowListComponent, BorrowRequestFormComponent, BorrowApprovalsComponent],
  imports: [SharedModule, BorrowRoutingModule]
})
export class BorrowModule {}