import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookRequestService } from '../../services/book-request.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent {
  form: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private requestService: BookRequestService,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      author: [''],
      reason: ['']
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    const user = this.auth.currentUserValue;

    const payload = {
      ...this.form.value,
      memberId: user?.id,
      memberName: user?.name,
      requestDate: new Date().toISOString().slice(0, 10),
      status: 'Pending' as const
    };

    this.requestService.addRequest(payload).subscribe({
      next: () => {
        this.toast.success('Request submitted.');
        this.router.navigate(['/requests']);
      },
      error: () => {
        this.submitting = false;
        this.toast.error('Could not submit request.');
      }
    });
  }
}