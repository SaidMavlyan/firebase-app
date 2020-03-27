import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private router: Router) {
  }

  printError(event) {
    // todo: handle error
    console.error('>>>>', event);
  }

  async onLoginSuccess() {
    await this.router.navigateByUrl('/meals');
  }
}
