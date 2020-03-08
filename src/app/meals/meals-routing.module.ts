import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MealsComponent } from './meals/meals.component';
import { AdminMealsComponent } from './admin-meals/admin-meals.component';
import { AngularFireAuthGuard, customClaims } from '@angular/fire/auth-guard';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { Roles } from '../const/roles';

const isAdmin = (next) => {
  return pipe(customClaims, map(claims => claims.role === Roles.admin));
};

const routes: Routes = [
  {
    path: '', component: MealsComponent
  },
  {
    path: 'admin', component: AdminMealsComponent,
    canActivate: [AngularFireAuthGuard], data: {authGuardPipe: isAdmin}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MealsRoutingModule {
}
