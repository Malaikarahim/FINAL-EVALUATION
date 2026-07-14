import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from '../../services/member.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {
  isEditMode = false;
  memberId: number | null = null;
  submitted = false;
  saving = false;

  form: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.memberId = Number(idParam);
      this.memberService.getMember(this.memberId).subscribe(member => {
        this.form.patchValue(member);
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.saving = true;
    const value = this.form.getRawValue();
    const payload = {
      name: value.name!,
      email: value.email!,
      phone: value.phone!,
      joinedDate: new Date().toISOString().slice(0, 10)
    };

    const request$ = this.isEditMode
      ? this.memberService.updateMember({ id: this.memberId!, ...payload })
      : this.memberService.addMember(payload);

    request$.subscribe({
      next: () => {
        this.toast.success(this.isEditMode ? 'Member updated.' : 'Member registered.');
        this.router.navigate(['/members']);
      },
      error: () => (this.saving = false)
    });
  }

  cancel(): void {
    this.router.navigate(['/members']);
  }
}
