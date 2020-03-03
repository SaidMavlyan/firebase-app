import { UserService } from '../services/user.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../models/user';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  form: FormGroup;
  user: User;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<UserDialogComponent>,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) user: User) {
    this.user = user;
    console.log('user', user)

    this.form = fb.group({
      displayName: [user.displayName, Validators.required],
      email: [user.email, Validators.required]
    });
  }

  ngOnInit() {
  }

  save() {
    this.userService.edit({uid: this.user.uid, ...this.form.value})
        .subscribe((v) => {
          this.dialogRef.close(this.form.value);
        });
  }

  close() {
    this.dialogRef.close();
  }
}
