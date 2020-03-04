import { Component, Inject } from '@angular/core';
import { User } from '../models/user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-delete-dialog',
  templateUrl: './user-delete-dialog.component.html',
  styleUrls: ['./user-delete-dialog.component.scss']
})
export class UserDeleteDialogComponent {

  user: User;

  constructor(private dialogRef: MatDialogRef<UserDeleteDialogComponent>,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) user: User) {
    this.user = user;
  }

  delete() {
    this.userService.delete(this.user)
        .subscribe(() => {
          this.dialogRef.close(true);
        });
  }

  close() {
    this.dialogRef.close();
  }
}
