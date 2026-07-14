import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MembersRoutingModule } from './members-routing.module';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberFormComponent } from './member-form/member-form.component';

@NgModule({
  declarations: [MemberListComponent, MemberFormComponent],
  imports: [SharedModule, MembersRoutingModule]
})
export class MembersModule {}
