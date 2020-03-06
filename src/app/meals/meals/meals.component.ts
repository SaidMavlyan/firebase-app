import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MealDialogComponent } from '../meal-dialog/meal-dialog.component';
import { MealService } from '../services/meal.service';
import { Meal } from '../models/meal';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss']
})
export class MealsComponent implements OnInit {

  dialogConfig = new MatDialogConfig();

  constructor(private db: AngularFirestore,
              private dialog: MatDialog,
              private mealService: MealService) {
    this.db.collection('meals').valueChanges().subscribe(items => {
      console.log('meals', items);
    });
  }

  ngOnInit(): void {
    this.dialogConfig.width = '400px';
  }

  createMeal() {
    this.openMealDialog();
  }

  editMeal(meal: Meal) {
    this.openMealDialog(meal);
  }

  openMealDialog(meal?: Meal) {
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.data = meal || {};

    this.dialog.open(MealDialogComponent, this.dialogConfig)
        .afterClosed()
        .subscribe((val) => {
          if (val) {
            // this.mealService.loadMeals();
          }
        });
  }

  deleteMeal(meal: Meal) {
    this.dialogConfig.data = meal;

    // this.dialog.open(MealDeleteDialogComponent, this.dialogConfig)
    //     .afterClosed()
    //     .subscribe((val) => {
    //       if (val) {
    //         this.mealService.loadMeals();
    //       }
    //     });
  }
}

