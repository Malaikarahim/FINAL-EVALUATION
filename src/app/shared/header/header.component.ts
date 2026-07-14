import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

const LOGOUT_DISPLAY_MS = 1800;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showLogoutOverlay = false;

  constructor(public auth: AuthService, private router: Router) {}

  logout(): void {
    this.showLogoutOverlay = true;
    // Clear the session right away so nothing behind the popup stays
    // interactive, then hold the popup on screen briefly before
    // navigating to login.
    this.auth.logout();

    setTimeout(() => {
      this.showLogoutOverlay = false;
      this.router.navigate(['/auth/login']);
    }, LOGOUT_DISPLAY_MS);
  }
}