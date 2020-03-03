import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private router: Router, private db: AngularFirestore) {
  }

  printError(event) {
    console.error(event);
  }

  async onLoginSuccess() {
    await this.router.navigateByUrl('/meals');
  }
}
