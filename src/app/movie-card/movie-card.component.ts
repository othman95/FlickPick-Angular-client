import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

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

type User = {
  _id?: string;
  Name: string;
  FavoriteMovies?: string[];
};

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: Movie[] = [];
  user?: User; // User is optional

  constructor(private fetchApiData: FetchApiDataService) { }

  ngOnInit(): void {
    this.getMovies();
    this.getUser();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((movies: Movie[]) => {
      this.movies = movies;
    });
  }

  getUser(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  isFavorite(movie: Movie): boolean {
    return this.user?.FavoriteMovies?.includes(movie._id) ?? false;
  }

  toggleFavorite(movie: Movie): void {
    if (this.isFavorite(movie)) {
      this.removeFavoriteMovie(movie._id);
    } else {
      this.addFavoriteMovie(movie._id);
    }
  }

  addFavoriteMovie(movieId: string): void {
    if (this.user && this.user.Name) {
      this.fetchApiData.addFavoriteMovie(this.user.Name, movieId).subscribe({
        next: (response) => {
          if (this.user) {
            // Update the local favoriteMovies array and local storage
            this.user.FavoriteMovies = [...(this.user.FavoriteMovies ?? []), movieId];
            localStorage.setItem('user', JSON.stringify(this.user));
            console.log('Movie added to favorites:', response);
          }
        },
        error: (error) => console.error('Error adding movie to favorites:', error)
      });
    }
  }

  removeFavoriteMovie(movieId: string): void {
    if (this.user && this.user.Name) {
      this.fetchApiData.deleteFavoriteMovie(this.user.Name, movieId).subscribe({
        next: (response) => {
          if (this.user) {
            // Update the local favoriteMovies array and local storage
            this.user.FavoriteMovies = this.user.FavoriteMovies?.filter(id => id !== movieId) ?? [];
            localStorage.setItem('user', JSON.stringify(this.user));
            console.log('Movie removed from favorites:', response);
          }
        },
        error: (error) => console.error('Error removing movie from favorites:', error)
      });
    }
  }
}
