import { Component, OnInit } from '@angular/core';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.login(this.email, this.password)
      .subscribe({
        next: (response) => {
          this.successMessage = response.message;
          // Store user data in localStorage
          localStorage.setItem('userId', response.userId.toString());
          localStorage.setItem('name', response.name);
          localStorage.setItem('job', response.job);
          localStorage.setItem('isLoggedIn', 'true');
          
          // Redirect and reload the page
          this.router.navigate(['/home']).then(() => {
            window.location.reload(); // Reload the page after navigation
          });
        },
        error: (error) => {
          this.errorMessage = 'Login failed. Please check your credentials.';
          console.error('Login error:', error);
        }
      });
  }
}