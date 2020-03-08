import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../users/models/user';
import { UserService } from '../../users/services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserDialogComponent } from '../../users/user-dialog/user-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {

  uid: string;
  user$: Observable<User>;
  dialogConfig = new MatDialogConfig();

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private afAuth: AngularFireAuth
  ) {
  }

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      if (!!user) {
        this.uid = user.uid;
        this.user$ = this.userService.user$(this.uid);
      }
    });
  }

  edit(user: User) {
    this.dialogConfig.data = user;
    this.openUserDialog();
  }

  openUserDialog() {
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.width = '400px';

    this.dialog.open(UserDialogComponent, this.dialogConfig)
        .afterClosed()
        .subscribe((val) => {
          this.user$ = this.userService.user$(this.uid);
        });
  }
}
