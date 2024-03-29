import { UserService } from '../services/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { UserDeleteDialogComponent } from '../user-delete-dialog/user-delete-dialog.component';
import { Roles } from '../../const/roles';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  users: User[];
  dialogConfig = new MatDialogConfig();
  subscriptions: Subscription[] = [];
  currentUser: User;

  constructor(
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private userService: UserService,
  ) {
    this.subscriptions.push(
      this.userService.currentUser$.subscribe(user => this.currentUser = user)
    );
  }

  ngOnInit() {
    this.subscriptions.push(
      this.userService.usersSubject$.subscribe(userList => {
        if (!!userList) {
          this.users = userList.sort(this.comparatorForUsers);
        }
      })
    );

    this.userService.loadUsers();
    this.dialogConfig.width = '400px';
  }

  comparatorForUsers(a: User, b: User) {
    if (a.role.localeCompare(b.role) === 0) {
      return a.displayName.localeCompare(b.displayName);
    }
    return a.role.localeCompare(b.role);
  }

  createUser() {
    this.dialogConfig.data = {};
    this.openUserDialog();
  }

  editUser(user: User) {
    this.dialogConfig.data = user;
    this.openUserDialog();
  }

  openUserDialog() {
    this.dialogConfig.autoFocus = true;

    this.dialog.open(UserDialogComponent, this.dialogConfig)
        .afterClosed()
        .subscribe((val) => {
          if (val) {
            this.userService.loadUsers();
          }
        });
  }

  deleteUser(user: User) {
    this.dialogConfig.data = {user};

    this.dialog.open(UserDeleteDialogComponent, this.dialogConfig)
        .afterClosed()
        .subscribe((val) => {
          if (val) {
            this.userService.loadUsers();
          }
        });
  }

  isAdmin() {
    return this.currentUser?.role === Roles.admin;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }
}
