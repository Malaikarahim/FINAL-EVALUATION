import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member.model';
import { MemberService } from '../../services/member.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  searchTerm = '';
  loaded = false;
  confirmingDeleteId: number | null = null;

  constructor(private memberService: MemberService, private toast: ToastService) {}

  ngOnInit(): void {
    this.memberService.getMembers().subscribe(members => {
      this.members = members;
      this.loaded = true;
    });
  }

  askDelete(id: number): void {
    this.confirmingDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmingDeleteId = null;
  }

  confirmDelete(): void {
    if (this.confirmingDeleteId == null) return;
    const id = this.confirmingDeleteId;
    this.memberService.deleteMember(id).subscribe(() => {
      this.members = this.members.filter(m => m.id !== id);
      this.toast.success('Member removed.');
      this.confirmingDeleteId = null;
    });
  }
}
