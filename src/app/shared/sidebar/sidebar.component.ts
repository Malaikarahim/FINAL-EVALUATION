import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  tag: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = false;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'grid', route: '/dashboard', tag: '#1B4332' },
    { label: 'Books', icon: 'book', route: '/books', tag: '#C08A3E' },
    { label: 'Members', icon: 'users', route: '/members', tag: '#2F5D78', adminOnly: true },
    { label: 'Borrow & Return', icon: 'swap', route: '/borrow', tag: '#A4342A' },
    { label: 'Book Requests', icon: 'inbox', route: '/requests', tag: '#8B5E3C' }
  ];

  constructor(public auth: AuthService) {}

  get visibleItems(): NavItem[] {
    const role = this.auth.getRole();
    return this.navItems.filter(item => !item.adminOnly || role === 'admin');
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}