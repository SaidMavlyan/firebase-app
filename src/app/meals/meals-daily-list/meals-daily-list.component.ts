import { Component, Input, OnInit } from '@angular/core';
import { Meal } from '../models/meal';
import { MealDialogComponent } from '../meal-dialog/meal-dialog.component';
import { MealDeleteDialogComponent } from '../meal-delete-dialog/meal-delete-dialog.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-meals-daily-list',
  templateUrl: './meals-daily-list.component.html',
  styleUrls: ['./meals-daily-list.component.scss']
})
export class MealsDailyListComponent implements OnInit {

  @Input() meals: Meal[];
  @Input() limit: number;

  dialogConfig = new MatDialogConfig();
  totalCalories = 0;

  constructor(private db: AngularFirestore,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.meals.sort((a, b) => a.time.localeCompare(b.time));
    this.totalCalories = this.meals.reduce((total, meal) => total + Number(meal.calories), 0);
    this.dialogConfig.width = '400px';
    this.dialogConfig.autoFocus = true;
  }

  editMeal(meal: Meal) {
    this.dialogConfig.data = meal;
    this.dialog.open(MealDialogComponent, this.dialogConfig);
  }

  deleteMeal(meal: Meal) {
    this.dialogConfig.data = meal;
    this.dialog.open(MealDeleteDialogComponent, this.dialogConfig);
  }
}
