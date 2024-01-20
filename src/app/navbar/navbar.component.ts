import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {
  constructor(
    private fetchApiDataService: FetchApiDataService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px'
    });
  }

  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px'
    });
  }

  logout(): void {
    try {
      this.fetchApiDataService.logout();
      localStorage.clear();
      this.router.navigate(['/welcome']);
      this.snackBar.open('Logout successful', 'OK', { duration: 2000 });
    } catch (error) {
      this.snackBar.open('Error during logout', 'OK', { duration: 2000 });
      console.error('Logout error:', error);
    }
  }

  get isWelcomePage(): boolean {
    return this.router.url === '/welcome';
  }
}
