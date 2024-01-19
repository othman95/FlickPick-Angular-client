import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

// Define the User type
type User = {
  _id?: string;
  Name: string;
  Password: string;
  Email: string;
  Birthday: Date;
  FavoriteMovies?: string[];
};

// Define the Movie type
type Movie = {
  _id: string;
  Title: string;
  Director: {
    Name: string;
  };
  Genre: {
    Name: string;
  };
  Year: number;
  ImagePath: string;
};

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User = { Name: '', Email: '', Password: '', Birthday: new Date(), FavoriteMovies: [] };
  favoriteMovies: Movie[] = []; // Array of Movie objects

  constructor(
    public router: Router,
    public snackBar: MatSnackBar,
    public fetchApiData: FetchApiDataService
  ) { }

  ngOnInit(): void {
    // Load user profile and favorite movies on component initiation
    this.loadUserProfile();
    this.loadFavoriteMovies();
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
    // Update user information using the FetchApiDataService
    this.fetchApiData.editUser(this.user.Name, this.user).subscribe({
      next: (updatedUser) => {
        this.snackBar.open('Update successful', 'OK', { duration: 2000 });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.loadUserProfile(); // Reload the user profile
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.snackBar.open('Update error', 'OK', { duration: 2000 });
      }
    });
  }

  handleSubmit(): void {
    // Call updateUser method when form is submitted
    this.updateUser();
  }

  // Load favorite movies for the user
  loadFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((movies: Movie[]) => {
      this.favoriteMovies = movies.filter(movie =>
        this.user.FavoriteMovies?.includes(movie._id));
    });
  }

  // Check if a movie is in the user's favorites
  isFavorite(movie: Movie): boolean {
    return this.user.FavoriteMovies?.includes(movie._id) ?? false;
  }

  // Toggle the favorite status of a movie
  toggleFavorite(movie: Movie): void {
    if (this.isFavorite(movie)) {
      // Remove from favorites
      this.removeFavoriteMovie(movie._id);
    } else {
      // Add to favorites (implementation needed)
      this.addFavoriteMovie(movie._id);
    }
  }

  // Remove a movie from the user's favorite list
  removeFavoriteMovie(movieId: string): void {
    // Assuming you have the user's username
    const username = this.user.Name;

    this.fetchApiData.deleteFavoriteMovie(username, movieId).subscribe({
      next: (response: any) => {
        // Update your component's state to reflect the removal
        this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== movieId);
        console.log('Movie removed from favorites:', response);
      },
      error: (error: any) => {
        // Handle any errors here
        console.error('Error removing movie from favorites:', error);
      }
    });
  }

  // Add a movie to the user's favorite list
  addFavoriteMovie(movieId: string): void {
    const userName = this.user.Name;

    this.fetchApiData.addFavoriteMovie(userName, movieId).subscribe({
      next: (response: any) => {
        // Update the local favoriteMovies array to include the new favorite
        this.favoriteMovies.push(response);
        console.log('Movie added to favorites:', response);
      },
      error: (error: any) => {
        console.error('Error adding movie to favorites:', error);
      }
    });
  }
}
