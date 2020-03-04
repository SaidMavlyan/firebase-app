import { UserService } from '../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-form/user-dialog.component';
import { UserDeleteDialogComponent } from '../user-delete-dialog/user-delete-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users$: Subject<User[]>;
  dialogConfig = new MatDialogConfig();

  constructor(
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.users$ = this.userService.usersSubject$;
    this.userService.loadUsers();
    this.dialogConfig.width = '400px';
  }

  create() {
    this.openUserDialog();
  }

  editUser(user: User) {
    this.openUserDialog(user);
  }

  openUserDialog(user?: User) {
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.data = user || {};

    this.dialog.open(UserDialogComponent, this.dialogConfig)
        .afterClosed()
        .subscribe((val) => {
          if (val) {
            this.userService.loadUsers();
          }
        });
  }

  deleteUser(user: User) {
    this.dialogConfig.data = user;

    this.dialog.open(UserDeleteDialogComponent, this.dialogConfig)
        .afterClosed()
        .subscribe((val) => {
          if (val) {
            this.userService.loadUsers();
          }
        });
  }
}
