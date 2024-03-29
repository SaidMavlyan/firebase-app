import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MealDialogComponent } from '../meal-dialog/meal-dialog.component';
import { MealService } from '../services/meal.service';
import { Meal } from '../models/meal';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../../users/services/user.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss']
})
export class MealsComponent {

  dialogConfig = new MatDialogConfig();
  mealsByDate: Array<Meal[]> = [];
  currentUserId: string;
  dailyLimitCalories: number;

  constructor(private db: AngularFirestore,
              private dialog: MatDialog,
              private userService: UserService,
              private loaderService: LoaderService,
              private afAuth: AngularFireAuth,
              private mealService: MealService) {
    this.userService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.dailyLimitCalories = Number(user.dailyCalories) || 0;

        this.mealService.loadUserMeals(this.currentUserId).subscribe(meals => {

          const temp = {};
          meals.forEach((meal) => {
            if (!temp[meal.date]) {
              temp[meal.date] = [];
            }
            temp[meal.date].push(meal);
          });

          const tempArr = Object.values(temp) as Meal[][];
          this.mealsByDate = tempArr.sort((a, b) => b[0].date.localeCompare(a[0].date));

        });
      }
    });
  }

  createMeal() {
    this.dialogConfig.width = '400px';
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.data = {uid: this.currentUserId};
    this.dialog.open(MealDialogComponent, this.dialogConfig);
  }
}
