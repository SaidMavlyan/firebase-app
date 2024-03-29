import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileSettingsComponent } from './components/profile/profile-settings.component';
import {
  AngularFireAuthGuard,
  customClaims,
  redirectLoggedInTo,
  redirectUnauthorizedTo
} from '@angular/fire/auth-guard';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserManagerRoles } from './const/roles';
import { HomeComponent } from './components/home/home.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToMeals = () => redirectLoggedInTo(['meals']);
const withUserManagingPermissions = (next) => {
  return pipe(customClaims, map(claims => UserManagerRoles.includes(claims.role)));
};

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'settings',
        component: ProfileSettingsComponent,
        canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin}
      },
      {
        path: 'meals',
        loadChildren: () => import('./meals/meals.module').then(m => m.MealsModule),
        canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin}
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        canActivate: [AngularFireAuthGuard], data: {authGuardPipe: withUserManagingPermissions}
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectLoggedInToMeals}
  },
  {
    path: '**',
    redirectTo: '/'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
