import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserManagerRoles } from '../../const/roles';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  isUserManager = false;
  subscription: Subscription;

  constructor(private afAuth: AngularFireAuth,
              private router: Router) {
  }

  ngOnInit(): void {
    this.subscription = this.afAuth.user.subscribe((user) => {
      this.isLoggedIn = !!user;
      user?.getIdTokenResult().then(token => {
        this.isUserManager = UserManagerRoles.includes(token.claims.role);
      });
    });
  }

  async logout() {
    await this.afAuth.auth.signOut();
    await this.router.navigateByUrl('/');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
