import { Component, OnInit } from '@angular/core';
import { Meal } from '../models/meal';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserService } from '../../users/services/user.service';
import { LoaderService } from '../../services/loader.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { MealService } from '../services/meal.service';
import { MealDeleteDialogComponent } from '../meal-delete-dialog/meal-delete-dialog.component';
import { MealDialogComponent } from '../meal-dialog/meal-dialog.component';

@Component({
  selector: 'app-admin-meals',
  templateUrl: './admin-meals.component.html',
  styleUrls: ['./admin-meals.component.scss']
})
export class AdminMealsComponent implements OnInit {

  sortedMeals: Meal[] = [];
  displayedColumns: string[] = ['date', 'time', 'description', 'calories', 'actions'];
  dialogConfig = new MatDialogConfig();

  constructor(private db: AngularFirestore,
              private dialog: MatDialog,
              private userService: UserService,
              private loaderService: LoaderService,
              private afAuth: AngularFireAuth,
              private mealService: MealService) {
    this.userService.currentUser$.subscribe((user) => {
      if (user) {
        this.mealService.loadAllMeals().subscribe(meals => {
          this.sortedMeals = meals.sort((a, b) => a.date.localeCompare(b.date));
        });
      }
    });
  }

  ngOnInit() {
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
