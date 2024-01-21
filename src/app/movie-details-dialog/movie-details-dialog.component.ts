import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-details-dialog',
  templateUrl: './movie-details-dialog.component.html',
  styleUrls: ['./movie-details-dialog.component.scss']
})
export class MovieDetailsDialogComponent {
  details: any; // Holds the fetched movie details

  constructor(
    public dialogRef: MatDialogRef<MovieDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Data passed to the dialog
    private fetchApiData: FetchApiDataService
  ) { }

  ngOnInit(): void {
    this.fetchDetails(); // Call the function to fetch movie details when the component initializes
  }

  fetchDetails(): void {
    switch (this.data.type) {
      case 'director':
        // Extract director's name from the movie object
        const directorName = this.data.movie.Director.Name;
        this.fetchApiData.getDirector(directorName).subscribe(
          response => {
            this.details = response;
          },
          error => {
            console.error('Error fetching director details:', error);
          }
        );
        break;

      case 'genre':
        // Extract genre's name from the movie object
        const genreName = this.data.movie.Genre.Name;
        this.fetchApiData.getGenre(genreName).subscribe(
          response => {
            this.details = response;
          },
          error => {
            console.error('Error fetching genre details:', error);
          }
        );
        break;

      case 'synopsis':
        // For synopsis, use the movie object directly
        this.details = this.data.movie;
        break;

      default:
        console.error('Unknown detail type:', this.data.type);
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
