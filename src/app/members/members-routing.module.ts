import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberFormComponent } from './member-form/member-form.component';
import { RoleGuard } from '../guards/role.guard';

const routes: Routes = [
  { path: '', component: MemberListComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
  { path: 'new', component: MemberFormComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
  { path: ':id/edit', component: MemberFormComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule {}
