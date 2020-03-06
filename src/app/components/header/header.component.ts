import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;

  constructor(private afAuth: AngularFireAuth,
              private router: Router) {
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.afAuth.authState.pipe(map(user => !!user));
  }

  async logout() {
    await this.afAuth.auth.signOut();
    await this.router.navigateByUrl('/');
  }
}
