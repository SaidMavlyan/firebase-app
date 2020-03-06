import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MealDialogComponent } from '../meal-dialog/meal-dialog.component';
import { MealService } from '../services/meal.service';
import { Meal } from '../models/meal';
import { Observable } from 'rxjs';
import { MealDeleteDialogComponent } from '../meal-delete-dialog/meal-delete-dialog.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserManagerRoles } from '../../const/roles';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss']
})
export class MealsComponent implements OnInit {

  dialogConfig = new MatDialogConfig();
  meals$: Observable<Meal[]>;
  currentUserId: string;

  constructor(private db: AngularFirestore,
              private dialog: MatDialog,
              private afAuth: AngularFireAuth,
              private mealService: MealService) {
    this.afAuth.user.subscribe((user) => {
      this.currentUserId = user.uid;
      this.meals$ = this.mealService.loadUserMeals(this.currentUserId);
    });
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
