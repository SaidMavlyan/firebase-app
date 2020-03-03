import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../users/models/user';
import { filter, switchMap } from 'rxjs/operators';
import { UserService } from '../../users/services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user$: Observable<User>;

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth
  ) {
  }

  ngOnInit(): void {
    this.user$ = this.afAuth.user.pipe(
      filter(user => !!user),
      switchMap(user => this.userService.user$(user.uid))
    );
  }

  edit(user: User) {
    console.log('edit()', user);
  }
}
