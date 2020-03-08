import { UserService } from '../services/user.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role, User } from '../models/user';
import { UserManagerRoles } from '../../const/roles';
import { Subscription } from 'rxjs';

const PASS_MIN_LEN = 8;
const NAME_MAX_LEN = 50;

@Component({
  selector: 'app-user-form',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit, OnDestroy {

  form: FormGroup;
  user: User;
  isEditing = false;
  isRoleEditor = false;
  subscription: Subscription;
  roles: Role[] = ['user', 'manager'];

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<UserDialogComponent>,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) user: User) {
    this.user = user;

    if (user.uid) {
      this.isEditing = true;
    }

    this.subscription = this.userService.currentUser$.subscribe(currentUser => {
      this.isRoleEditor = UserManagerRoles.includes(currentUser.role);
      if (currentUser.role === 'admin') {
        this.roles.push('admin');
      }
    });

  }

  ngOnInit() {
    this.form = this.fb.group({
      displayName: [this.user.displayName || '', [Validators.required, Validators.maxLength(NAME_MAX_LEN)]],
      email: [this.user.email || '', [Validators.required, Validators.email]],
      role: [this.user.role || 'user', Validators.required],
      dailyCalories: [this.user.dailyCalories || 0, Validators.pattern(/^\d{0,10}$/)]
    });

    if (!this.isEditing) {
      this.form.addControl('password',
        new FormControl('', [Validators.required, Validators.minLength(PASS_MIN_LEN)])
      );
    }
  }

  getValidationMessage(field: string) {
    if (this.form.controls[field].hasError('required')) {
      return 'You must enter a value';
    }

    switch (field) {
      case 'displayName':
        return this.form.controls.displayName.hasError('maxlength') ?
          `Name should be at most ${NAME_MAX_LEN} characters` : '';
      case 'email':
        return this.form.controls.email.hasError('email') ? 'Not a valid email' : '';
      case 'password':
        return this.form.controls.password.hasError('minlength') ?
          `Password should be at least ${PASS_MIN_LEN} characters` : '';
      case 'calories':
        return this.form.controls.dailyCalories.hasError('pattern') ? 'Not a valid number' : '';
      default:
        return 'Please enter correct value';
    }
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
