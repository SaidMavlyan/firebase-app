import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MealService } from '../services/meal.service';
import { Meal } from '../models/meal';
import * as moment from 'moment';

const TEXT_MAX_LEN = 500;
const SORTABLE_DATE = 'YYYY-MM-DD';

@Component({
  selector: 'app-add-edit-meal',
  templateUrl: './meal-dialog.component.html',
  styleUrls: ['./meal-dialog.component.scss'],
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
      userId: [this.meal.userId],
      date: [this.meal.date ? moment(this.meal.date, SORTABLE_DATE) : moment()],
      time: [this.meal.time || moment().format('HH:mm')],
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
    this.mealService.create(this.prepareForm(this.form.value))
        .then(() => this.close());
  }

  update() {
    this.mealService.update(this.meal.id, this.prepareForm(this.form.value))
        .then(() => this.close());
  }

  close() {
    this.dialogRef.close();
  }

  prepareForm(form: any) {
    return {...form, date: form.date.format(SORTABLE_DATE)};
  }
}
