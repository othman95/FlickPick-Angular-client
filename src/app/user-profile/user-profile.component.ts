import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

type User = {
  _id?: string;
  Name: string;
  Password: string;
  Email: string;
  Birthday: Date;
  FavoriteMovies?: string[];
};

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User = { Name: '', Email: '', Password: '', Birthday: new Date(), FavoriteMovies: [] };

  constructor(
    public router: Router,
    public snackBar: MatSnackBar,
    public fetchApiData: FetchApiDataService
  ) {}

  ngOnInit(): void {
    // Load user profile on component initiation
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Parse user data from local storage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    if (userData && userData.Name) {
      // Set user data if available
      this.user = userData;
    } else {
      // Redirect to welcome if user data not found
      this.router.navigate(['welcome']);
    }
  }

  updateUser(): void {
    // Update user information using fetch
    const token = localStorage.getItem('token');
    fetch(`https://flickpick-1911bf3985c5.herokuapp.com/users/${this.user.Name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(this.user)
    })
    .then(response => response.json())
    .then(updatedUser => {
      if (updatedUser) {
        this.snackBar.open('Update successful', 'OK', { duration: 2000 });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.loadUserProfile(); // Reload the user profile to reflect the updates
      } else {
        this.snackBar.open('Update failed', 'OK', { duration: 2000 });
      }
    })
    .catch(error => {
      console.error('Error updating user:', error);
      this.snackBar.open('Update error', 'OK', { duration: 2000 });
    });
  }

  handleSubmit(): void {
    // Call updateUser method when form is submitted
    this.updateUser();
  }
}

