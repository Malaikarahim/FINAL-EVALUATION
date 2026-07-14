import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { RoleGuard } from '../guards/role.guard';

const routes: Routes = [
  { path: '', component: RequestListComponent },
  { path: 'new', component: RequestFormComponent, canActivate: [RoleGuard], data: { roles: ['member'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestsRoutingModule {}