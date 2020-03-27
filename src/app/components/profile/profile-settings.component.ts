import { Component } from '@angular/core';
import { User } from '../../users/models/user';
import { UserService } from '../../users/services/user.service';
import { UserDialogComponent } from '../../users/user-dialog/user-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserDeleteDialogComponent } from '../../users/user-delete-dialog/user-delete-dialog.component';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NotifierService } from '../../services/notifier.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent {

  uid: string;
  dialogConfig = new MatDialogConfig();

  constructor(
    private dialog: MatDialog,
    private notifierService: NotifierService,
    private router: Router,
    private afAuth: AngularFireAuth,
    public userService: UserService,
  ) {
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.width = '400px';
  }

  edit(user: User) {
    this.dialogConfig.data = user;

    this.dialog.open(UserDialogComponent, this.dialogConfig)
        .afterClosed()
        .subscribe((status) => {
          if (status) {
            this.userService.reloadCurrentUser();
          }
        });
  }

  delete(user: User) {
    this.dialogConfig.data = user;

    this.dialog.open(UserDeleteDialogComponent, this.dialogConfig)
        .afterClosed()
        .subscribe(async (val) => {
          if (val) {
            this.userDeletionHandler(user);
          }
        });

  }

  async userDeletionHandler(user: User) {
    try {
      await this.afAuth.auth.signOut();
      this.notifierService.info(`Account of ${user.email} is successfully deleted.`);
      await this.router.navigateByUrl('/');
    } catch (e) {
      this.notifierService.error(`Could not delete account`);
    }
  }
}
