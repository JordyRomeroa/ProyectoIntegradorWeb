import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './admin.sidebar.component.html',
  styleUrls: ['./admin.sidebar.component.css'],
  standalone: true
})
export class AdminSidebarComponent {

  constructor(private router: Router) {}

  nav(route: string) {
    this.router.navigate([`/admin/${route}`]);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  go(path: string) {
    this.router.navigate([path]);
  }
}
