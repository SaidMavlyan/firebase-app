import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Meal } from '../models/meal';
import { MealService } from '../services/meal.service';

@Component({
  selector: 'app-meal-delete-dialog',
  templateUrl: './meal-delete-dialog.component.html',
  styleUrls: ['./meal-delete-dialog.component.scss']
})
export class MealDeleteDialogComponent {

  meal: Meal;

  constructor(private dialogRef: MatDialogRef<MealDeleteDialogComponent>,
              private mealService: MealService,
              @Inject(MAT_DIALOG_DATA) meal: Meal) {
    this.meal = meal;
  }

  delete() {
    this.mealService.delete(this.meal)
        .then(() => {
          this.dialogRef.close(true);
        });
  }

  close() {
    this.dialogRef.close();
  }
}
