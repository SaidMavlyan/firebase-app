import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MealService } from '../services/meal.service';
import { Meal } from '../models/meal';

const TEXT_MAX_LEN = 500;

@Component({
  selector: 'app-add-edit-meal',
  templateUrl: './meal-dialog.component.html',
  styleUrls: ['./meal-dialog.component.scss']
})
export class MealDialogComponent implements OnInit {

  meal: Meal;
  form: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder,
              private mealService: MealService,
              private dialogRef: MatDialogRef<MealDialogComponent>,
              @Inject(MAT_DIALOG_DATA) meal: Meal) {
    if (meal.id) {
      this.isEditing = true;
    }
    this.meal = meal;
  }

  ngOnInit() {
    this.form = this.fb.group({
      description: [this.meal.description || '', [Validators.required, Validators.maxLength(TEXT_MAX_LEN)]],
      calories: [this.meal.calories || undefined, [Validators.required, Validators.pattern(/^[1-9]\d{0,10}$/)]],
    });
  }

  getValidationMessage(field: string) {
    if (this.form.controls[field].hasError('required')) {
      return 'You must enter a value';
    }

    switch (field) {
      case 'description':
        return this.form.controls.displayName.hasError('maxlength') ?
          `Description should be at most ${TEXT_MAX_LEN} characters` : '';
      case 'calories':
        return this.form.controls.calories.hasError('pattern') ? 'Not a valid number' : '';
      default:
        return 'Please enter correct value';
    }
  }

  create() {
    console.log('create', this.form.value);
    // this.userService.create({...this.form.value})
    //     .subscribe((v) => {
    //       this.dialogRef.close(this.form.value);
    //     });
  }

  update() {
    console.log('update', this.form.value);
    // this.userService.edit({uid: this.user.uid, ...this.form.value})
    //     .subscribe((v) => {
    //       this.dialogRef.close(this.form.value);
    //     });
  }

  close() {
    this.dialogRef.close();
  }
}
