import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserManagerRoles } from '../../const/roles';
import { Subscription } from 'rxjs';
import { UserService } from '../../users/services/user.service';

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
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.subscription = this.userService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.isUserManager = UserManagerRoles.includes(user?.role);
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
