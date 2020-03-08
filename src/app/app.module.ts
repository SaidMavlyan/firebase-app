import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthTokenHttpInterceptorProvider } from './services/auth-token.interseptor';
import { UsersModule } from './users/users.module';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { ProfileSettingsComponent } from './components/profile/profile-settings.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { SharedModule } from './shared/shared.module';
import { MealsModule } from './meals/meals.module';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProgressBarComponent,
    HeaderComponent,
    ProfileSettingsComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatPasswordStrengthModule.forRoot(),
    UsersModule,
    MealsModule,
    NgxAuthFirebaseUIModule.forRoot(environment.firebase),
  ],
  exports: [
  ],
  providers: [
    AuthTokenHttpInterceptorProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
