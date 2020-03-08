import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../../users/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  subscription: Subscription;

  constructor(private afAuth: AngularFireAuth,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.subscription = this.userService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  async logout() {
    await this.afAuth.auth.signOut();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
