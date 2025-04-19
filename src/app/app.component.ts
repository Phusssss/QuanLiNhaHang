// app.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'QuanLiNhaHang';
  isMenuOpen = false;
  userName: string = localStorage.getItem('name') || '';
  isLoggedIn: boolean = localStorage.getItem('isLoggedIn') === 'true';

  constructor(private router: Router) {
    // Listen for storage changes
    window.addEventListener('storage', () => {
      this.userName = localStorage.getItem('name') || '';
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn = false;
    this.userName = '';
    this.router.navigate(['/login']);
    this.closeMenu();
  }
}