import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MealDialogComponent } from '../meal-dialog/meal-dialog.component';
import { MealService } from '../services/meal.service';
import { Meal } from '../models/meal';
import { MealDeleteDialogComponent } from '../meal-delete-dialog/meal-delete-dialog.component';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss']
})
export class MealsComponent implements OnInit {

  dialogConfig = new MatDialogConfig();
  mealsByDate: Array<Meal[]>;
  currentUserId: string;

  constructor(private db: AngularFirestore,
              private dialog: MatDialog,
              private afAuth: AngularFireAuth,
              private mealService: MealService) {
    this.afAuth.user.subscribe((user) => {
      this.currentUserId = user.uid;

      this.mealService.loadUserMeals(this.currentUserId).subscribe(meals => {
        this.mealsByDate = [[]];
        const sorted = meals.sort(this.comparatorForMeal);
        sorted.forEach((meal, i) => {
          if (this.mealsByDate[0].length > 0 && this.mealsByDate[0][0].date !== meal.date) {
            this.mealsByDate.unshift([]);
          }

          this.mealsByDate[0].push(meal);
        });
      });
    });
  }

  comparatorForMeal(a: Meal, b: Meal) {
    if (a.date.localeCompare(b.date) === 0) {
      return b.time.localeCompare(a.time);
    }
    return a.date.localeCompare(b.date);
  }

  ngOnInit(): void {
    this.dialogConfig.width = '400px';
    this.dialogConfig.autoFocus = true;
  }

  createMeal() {
    this.dialogConfig.data = {userId: this.currentUserId};
    this.openMealDialog();
  }

  editMeal(meal: Meal) {
    this.dialogConfig.data = meal;
    this.openMealDialog();
  }

  openMealDialog() {
    this.dialog.open(MealDialogComponent, this.dialogConfig);
  }

  deleteMeal(meal: Meal) {
    this.dialogConfig.data = meal;
    this.dialog.open(MealDeleteDialogComponent, this.dialogConfig);
  }
}
