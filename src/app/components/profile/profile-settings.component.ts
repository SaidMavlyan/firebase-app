import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../users/models/user';
import { UserService } from '../../users/services/user.service';
import { UserDialogComponent } from '../../users/user-dialog/user-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {

  uid: string;
  currentUser: User;
  dialogConfig = new MatDialogConfig();

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => this.currentUser = user);
  }

  edit(user: User) {
    this.dialogConfig.data = user;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.width = '400px';

    this.dialog.open(UserDialogComponent, this.dialogConfig)
        .afterClosed()
        .subscribe((status) => {
          if (status) {
            this.userService.reloadCurrentUser();
          }
        });
  }
}
