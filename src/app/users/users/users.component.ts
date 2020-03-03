import { UserService } from '../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-form/user-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users$: Observable<User[]>;

  constructor(
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.users$ = this.userService.users$;
  }

  create() {
    this.openUserDialog();
  }

  editUser(user: User) {
    this.openUserDialog(user);
  }

  openUserDialog(user?: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = user || {};

    this.dialog.open(UserDialogComponent, dialogConfig)
        .afterClosed()
        .subscribe((val) => {
          if (val) {
            this.userService.users$.subscribe(v => this.users$ = of(v));
          }
        });
  }

  deleteUser(user: User) {

  }
}
