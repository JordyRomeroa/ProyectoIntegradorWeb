import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-programmer-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './programmer-sidebar.component.html',
  styleUrls: ['./programmer-sidebar.component.css']
})
export class ProgrammerSidebarComponent implements OnInit {

  currentUserName: string = 'Programador'; // Default name
  currentUserEmail: string = ''; // Default email
  // You might fetch actual programmer data to display here

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.pipe(
      switchMap((user: User | null) => {
        if (user) {
          this.currentUserEmail = user.email || '';
          // Fetch full programmer profile if needed for name
          return this.authService.getUserRole(user.uid);
        }
        return of(null);
      })
    ).subscribe(role => {
      // Role check or other initialization based on user
    });
  }

  go(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
  }
}
