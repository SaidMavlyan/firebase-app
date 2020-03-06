import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealsComponent } from './meals/meals.component';
import { SharedModule } from '../shared/shared.module';
import { MealDialogComponent } from './meal-dialog/meal-dialog.component';
import { MealsRoutingModule } from './meals-routing.module';
import { MealDeleteDialogComponent } from './meal-delete-dialog/meal-delete-dialog.component';


@NgModule({
  declarations: [
    MealsComponent,
    MealDialogComponent,
    MealDeleteDialogComponent
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
