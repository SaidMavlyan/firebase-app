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
  isEditing = false;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<UserDialogComponent>,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) user: User) {
    if (user.uid) {
      this.isEditing = true;
    }
    this.user = user;
    this.form = this.fb.group({
      displayName: [this.user.displayName || '', Validators.required],
      email: [this.user.email || '', Validators.required],
      password: ['', Validators.required],
      role: [this.user.role || 'user', Validators.required]
    });
  }

  ngOnInit() {
  }

  create() {
    this.userService.create({...this.form.value})
        .subscribe((v) => {
          this.dialogRef.close(this.form.value);
        });
  }

  update() {
    this.userService.edit({uid: this.user.uid, ...this.form.value})
        .subscribe((v) => {
          this.dialogRef.close(this.form.value);
        });
  }

  close() {
    this.dialogRef.close();
  }

}
