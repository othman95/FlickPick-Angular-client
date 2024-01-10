import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.css']
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Name: '', Password: '', Email: '', Birthday: '' };

  constructor(
      public fetchApiData: FetchApiDataService,
      public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
      public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: (response) => {
        this.dialogRef.close(); // This will close the modal on success
        console.log(response);
        this.snackBar.open('User registered successfully', 'OK', {
          duration: 2000
        });
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open(error, 'OK', {
          duration: 2000
        });
      },
      complete: () => {
        // Logic for when the subscription is complete goes here
      }
    });
  }
}
