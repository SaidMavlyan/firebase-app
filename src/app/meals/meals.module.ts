import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealsComponent } from './meals/meals.component';
import { SharedModule } from '../shared/shared.module';
import { MealDialogComponent } from './meal-dialog/meal-dialog.component';
import { MealsRoutingModule } from './meals-routing.module';


@NgModule({
  declarations: [
    MealsComponent,
    MealDialogComponent
  ],
  entryComponents: [
    MealDialogComponent
  ],
  imports: [
    CommonModule,
    MealsRoutingModule,
    SharedModule
  ]
})
export class MealsModule {
}
