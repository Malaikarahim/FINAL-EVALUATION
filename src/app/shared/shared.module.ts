import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ToastComponent } from './toast/toast.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { FilterByPipe } from './filter-by.pipe';
import { MainLayoutComponent } from './layout/main-layout.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    ToastComponent,
    ConfirmDialogComponent,
    FilterByPipe,
    MainLayoutComponent
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    ToastComponent,
    ConfirmDialogComponent,
    FilterByPipe,
    MainLayoutComponent
  ]
})
export class SharedModule {}
