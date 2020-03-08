import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealsComponent } from './meals/meals.component';
import { SharedModule } from '../shared/shared.module';
import { MealDialogComponent } from './meal-dialog/meal-dialog.component';
import { MealsRoutingModule } from './meals-routing.module';
import { MealDeleteDialogComponent } from './meal-delete-dialog/meal-delete-dialog.component';
import { MealsDailyListComponent } from './meals-daily-list/meals-daily-list.component';
import { AdminMealsComponent } from './admin-meals/admin-meals.component';


@NgModule({
  declarations: [
    MealsComponent,
    MealDialogComponent,
    MealDeleteDialogComponent,
    MealsDailyListComponent,
    AdminMealsComponent
  ],
  entryComponents: [
    MealDialogComponent,
    MealDeleteDialogComponent
  ],
  imports: [
    CommonModule,
    MealsRoutingModule,
    SharedModule
  ]
})
export class MealsModule {
}
