import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.css']
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Name: '', Password: '' };

  constructor(
      public fetchApiData: FetchApiDataService,
      public dialogRef: MatDialogRef<UserLoginFormComponent>,
      public snackBar: MatSnackBar,
      private router: Router) { }

  ngOnInit(): void {}

  loginUser(): void {
    console.log('Login');
    const credentials = {
      Name: this.userData.Name,
      Password: this.userData.Password
    };

    // Pass the credentials object to userLogin
    this.fetchApiData.userLogin(credentials).subscribe({
      next: (result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);

        // Display a success message
        this.snackBar.open('Login successful', 'OK', {
          duration: 2000,
        });

        this.dialogRef.close(); // Close the modal on success

        // Navigate to the 'movies' route
        this.router.navigate(['movies']);
      },
      error: (error) => {
        // Handle error
        this.snackBar.open(error, 'OK', {
          duration: 2000,
        });
      }
    });
  }
}
