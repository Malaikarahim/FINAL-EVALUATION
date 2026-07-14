import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { UserRole } from '../../models/user.model';

const WELCOME_DISPLAY_MS = 1800;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  submitting = false;
  submitted = false;
  form: ReturnType<FormBuilder['group']>;

  // Welcome popup state — shown right after a successful login,
  // auto-dismisses and navigates on its own (no manual Continue).
  showWelcome = false;
  welcomeName: string | null = null;
  welcomeRole: UserRole | null = null;
  private redirectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.form.controls; }

  fillDemo(role: 'admin' | 'member'): void {
    if (role === 'admin') {
      this.form.setValue({ email: 'admin@library.com', password: 'admin123' });
    } else {
      this.form.setValue({ email: 'member@library.com', password: 'member123' });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.submitting = true;
    const { email, password } = this.form.getRawValue();
    this.auth.login(email!, password!).subscribe({
      next: (res) => {
        this.welcomeName = res.user.name ?? null;
        this.welcomeRole = res.user.role;
        this.showWelcome = true;
        this.toast.success('Welcome back!');

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';

        // No manual Continue button — popup holds itself on screen
        // briefly, then navigates on its own, same pattern as logout.
        this.redirectTimer = setTimeout(() => {
          this.router.navigateByUrl(returnUrl);
        }, WELCOME_DISPLAY_MS);
      },
      error: () => {
        this.submitting = false;
      },
      complete: () => (this.submitting = false)
    });
  }

  ngOnDestroy(): void {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
    }
  }
}