import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RequestsRoutingModule } from './requests-routing.module';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestFormComponent } from './request-form/request-form.component';

@NgModule({
  declarations: [RequestListComponent, RequestFormComponent],
  imports: [SharedModule, RequestsRoutingModule]
})
export class RequestsModule {}