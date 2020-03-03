import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AddEditMealComponent } from './components/add-edit-meal/add-edit-meal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { MealsComponent } from './components/meals/meals.component';
import { AuthTokenHttpInterceptorProvider } from './services/auth-token.interseptor';
import { UsersModule } from './users/users.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProfileSettingsComponent } from './components/profile/profile-settings.component';
import { MatChipsModule } from '@angular/material/chips';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { MatDivider, MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [
    AppComponent,
    AddEditMealComponent,
    LoginComponent,
    ProgressBarComponent,
    HeaderComponent,
    MealsComponent,
    ProfileSettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDividerModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    UsersModule,
    MatPasswordStrengthModule.forRoot(),
    NgxAuthFirebaseUIModule.forRoot(environment.firebase),
  ],
  exports: [
  ],
  providers: [
    AuthTokenHttpInterceptorProvider
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddEditMealComponent]
})
export class AppModule {
}
